import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import logger from './logger.js';

export function checkClaudeAuth() {
  const credPath = join(homedir(), '.claude', '.credentials.json');

  if (!existsSync(credPath) &&
      !process.env.ANTHROPIC_API_KEY &&
      !process.env.CLAUDE_CODE_OAUTH_TOKEN) {
    throw new Error(
      'Claude Code authentication not configured.\n' +
      'Choose one of the following methods:\n' +
      '  1. Environment variable: CLAUDE_CODE_OAUTH_TOKEN (recommended for CI/CD)\n' +
      '  2. Mount credentials: -v ~/.claude:/root/.claude (for docker run)\n' +
      '  3. CI/CD variable: CLAUDE_CREDENTIALS (file type)\n' +
      '  4. Environment variable: ANTHROPIC_API_KEY\n' +
      `\nChecked locations:\n` +
      `  - ${credPath}: ${existsSync(credPath) ? 'found' : 'not found'}\n` +
      `  - CLAUDE_CODE_OAUTH_TOKEN: ${process.env.CLAUDE_CODE_OAUTH_TOKEN ? 'set' : 'not set'}\n` +
      `  - ANTHROPIC_API_KEY: ${process.env.ANTHROPIC_API_KEY ? 'set' : 'not set'}`
    );
  }

  // Log which authentication method is being used
  if (process.env.CLAUDE_CODE_OAUTH_TOKEN) {
    logger.info('Using CLAUDE_CODE_OAUTH_TOKEN environment variable');
  } else if (existsSync(credPath)) {
    logger.info('Using credentials from mounted file: ~/.claude/.credentials.json');
  } else if (process.env.ANTHROPIC_API_KEY) {
    logger.info('Using ANTHROPIC_API_KEY environment variable');
  }
}

function getClaudeModel(aiModel) {
  // Map common short names
  const modelMap = {
    'sonnet': 'sonnet',
    'opus': 'opus',
    'haiku': 'haiku',
    'claude-sonnet-4': 'claude-sonnet-4-20250514',
    'claude-sonnet-4.5': 'claude-sonnet-4-5-20250929'
  };

  // Return mapped value or pass through full ID
  return modelMap[aiModel] || aiModel || 'sonnet'; // default to sonnet
}

export async function runClaude(context, prompt) {
  logger.info('Running Claude Code...');

  checkClaudeAuth();

  // Handle empty prompt - provide a default
  const actualPrompt = prompt?.trim() || 'Review the current code and provide analysis or suggestions.';

  if (!prompt?.trim()) {
    logger.info('No prompt provided, using default prompt');
  }

  const args = [
    '-p', actualPrompt,
    '--model', getClaudeModel(context.aiModel),
    '--dangerously-skip-permissions'
  ];

  if (context.aiInstructions) {
    args.push('--append-system-prompt', context.aiInstructions);
  }

  logger.info(`Claude args: ${args.join(' ')}`);

  // Find the full path to claude binary
  const whichResult = spawnSync('which', ['claude'], {
    encoding: 'utf8',
    env: process.env
  });

  const claudePath = whichResult.stdout?.trim();

  if (!claudePath || whichResult.status !== 0) {
    throw new Error(
      `Claude CLI not found in PATH.\n` +
      `PATH: ${process.env.PATH}\n` +
      `which output: ${whichResult.stderr || 'no output'}`
    );
  }

  logger.info(`Found Claude CLI at: ${claudePath}`);

  // Get the real path (resolves symlinks)
  const readlinkResult = spawnSync('readlink', ['-f', claudePath], {
    encoding: 'utf8',
    env: process.env
  });

  const realPath = readlinkResult.stdout?.trim() || claudePath;
  logger.info(`Real path: ${realPath}`);

  // Execute with node explicitly instead of relying on shebang
  // This avoids issues with #!/usr/bin/env node not finding node in spawnSync context
  logger.info(`Executing: node ${realPath} ${args.join(' ')}`);
  logger.info(`Current working directory: ${process.cwd()}`);

  const result = spawnSync('node', [realPath, ...args], {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    maxBuffer: 10 * 1024 * 1024,
    // cwd removed - inherit current directory from process.cwd()
    // GitLab CI mounts to /builds/<project>, not /opt/agent/repo
    env: process.env
  });

  if (result.error) {
    logger.error(`Spawn error occurred: ${result.error.message}`);
    logger.error(`Error code: ${result.error.code}`);
    logger.error(`Error details: ${JSON.stringify(result.error)}`);

    if (result.error.code === 'ENOENT') {
      throw new Error(
        `Failed to execute Claude CLI.\n` +
        `Error: ${result.error.message}\n` +
        `Command: claude\n` +
        `PATH: ${process.env.PATH}\n` +
        `Working directory: /opt/agent/repo\n` +
        `Check that Claude Code CLI is installed and in PATH.`
      );
    }
    throw result.error;
  }

  if (result.status !== 0) {
    const stderr = result.stderr || '';
    const authKeywords = ['authentication', 'unauthorized', 'invalid credentials'];

    if (authKeywords.some(kw => stderr.toLowerCase().includes(kw))) {
      throw new Error(
        'Claude authentication failed. Check CLAUDE_CREDENTIALS or ANTHROPIC_API_KEY.'
      );
    }

    throw new Error(
      `Claude Code failed with exit code ${result.status}\n` +
      `stderr: ${stderr}\n` +
      `stdout: ${result.stdout}`
    );
  }

  logger.success('Claude Code completed');
  return result.stdout;
}
