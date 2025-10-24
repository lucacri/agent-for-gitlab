import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import logger from './logger.js';

export function checkClaudeAuth() {
  const credPath = join(homedir(), '.claude', '.credentials.json');

  if (!existsSync(credPath) && !process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      'Claude Code authentication not configured.\n' +
      'Set CI/CD variable: CLAUDE_CREDENTIALS (file type) or ANTHROPIC_API_KEY'
    );
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

  const args = [
    '-p', prompt,
    '--model', getClaudeModel(context.aiModel),
    '--dangerously-skip-permissions'
  ];

  if (context.aiInstructions) {
    args.push('--append-system-prompt', context.aiInstructions);
  }

  logger.info(`Claude args: ${args.join(' ')}`);

  // Execute the Claude CLI using the absolute path to the installed binary
  const claudePath = '/usr/bin/claude';

  logger.info(`Executing: ${claudePath} ${args.join(' ')}`);

  const result = spawnSync(claudePath, args, {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    maxBuffer: 10 * 1024 * 1024,
    cwd: '/opt/agent/repo'
  });

  if (result.error) {
    logger.error(`Spawn error occurred: ${result.error.message}`);
    logger.error(`Error code: ${result.error.code}`);
    logger.error(`Error details: ${JSON.stringify(result.error)}`);

    if (result.error.code === 'ENOENT') {
      throw new Error(
        `Failed to execute Claude CLI.\n` +
        `Error: ${result.error.message}\n` +
        `CLI path: ${claudePath}\n` +
        `Working directory: /opt/agent/repo\n` +
        `Check that Claude Code CLI is installed correctly.`
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
