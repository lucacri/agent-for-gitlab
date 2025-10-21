# Quick Start: Revert to Claude Code

**Feature**: 001-revert-claude-code
**Audience**: Developers implementing this feature

## Overview

This guide walks through reverting from OpenCode to Claude Code CLI in ~30 minutes.

---

## Prerequisites

- Docker installed locally for testing agent image
- GitLab project with CI/CD access
- Claude Code subscription or Anthropic API key for testing
- Text editor with find/replace

---

## Step 1: Update Dockerfile (5 min)

**File**: `agent-image/Dockerfile`

**Change**:
```diff
- RUN npm install -g opencode-ai
+ RUN npm install -g @anthropic-ai/claude-code
```

**Verification**:
```bash
cd agent-image
docker build -t agent-test .
docker run --rm agent-test claude --version
# Should output: Claude Code CLI version 2.x.x
```

---

## Step 2: Replace opencode.js with claude.js (15 min)

**Rename**: `agent-image/scripts/src/opencode.js` → `claude.js`

**Rewrite** `claude.js`:

```javascript
import { spawnSync } from 'node:child_process';
import logger from './logger.js';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export function checkClaudeAuth() {
  const credPath = path.join(os.homedir(), '.claude', '.credentials.json');

  if (!fs.existsSync(credPath) && !process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      'Claude Code authentication not configured.\n' +
      'Set CI/CD variable: CLAUDE_CREDENTIALS (file type) or ANTHROPIC_API_KEY'
    );
  }
}

function getClaudeModel(aiModel) {
  const modelMap = {
    'sonnet': 'sonnet',
    'opus': 'opus',
    'haiku': 'haiku'
  };
  return modelMap[aiModel] || aiModel || 'sonnet';
}

export function runClaude(context, prompt) {
  logger.info('Running Claude Code...');

  checkClaudeAuth();

  const args = [
    '-p', prompt,
    '--model', getClaudeModel(context.aiModel),
    '--allowedTools', 'Read', 'Write', 'Edit', 'Bash', 'Grep', 'Glob'
  ];

  if (context.aiInstructions) {
    args.push('--append-system-prompt', context.aiInstructions);
  }

  logger.info(`Claude args: ${args.join(' ')}`);

  const result = spawnSync('claude', args, {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    maxBuffer: 10 * 1024 * 1024,
    cwd: '/opt/agent/repo'
  });

  if (result.error) {
    if (result.error.code === 'ENOENT') {
      throw new Error('Claude Code CLI not found. Check Docker image build.');
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
```

**Update imports** in `runner.js`:

```diff
- import { runOpencode } from './opencode.js';
+ import { runClaude, checkClaudeAuth } from './claude.js';

// In run() function:
- await runOpencode(context, context.prompt);
+ checkClaudeAuth(); // Early auth check
+ await runClaude(context, context.prompt);
```

---

## Step 3: Update config.js (5 min)

**File**: `agent-image/scripts/src/config.js`

**Remove** multi-provider validation:

```diff
export function validateProviderKeys() {
-  const providerEnvVars = [
-    "OPENAI_API_KEY",
-    "ANTHROPIC_API_KEY",
-    "GROQ_API_KEY",
-    // ... (all provider keys)
-  ];
-  return providerEnvVars.some((k) => !!process.env[k]);
+  // Claude Code auth handled by checkClaudeAuth()
+  return true;
}
```

**Update** context.js for new variable names:

```diff
export function buildContext() {
  return {
    // ... existing fields
-   opencodeModel: process.env.OPENCODE_MODEL,
-   opencodeAgentPrompt: process.env.OPENCODE_AGENT_PROMPT,
+   aiModel: process.env.AI_MODEL || 'sonnet',
+   aiInstructions: process.env.AI_INSTRUCTIONS
  };
}
```

---

## Step 4: Update GitLab CI Configuration (3 min)

**File**: `gitlab-utils/.gitlab-ci.yml`

```diff
variables:
- AI_AGENT_IMAGE: "ghcr.io/schickli/agent-for-gitlab/agent-image:latest"
+ AI_AGENT_IMAGE: "ghcr.io/yourusername/agent-for-gitlab/agent-image:latest"
+ AI_MODEL: "sonnet"  # Optional: defaults to sonnet
+ # AI_INSTRUCTIONS set per-pipeline if needed

ai_webhook_handler:
  stage: ai
  image: $AI_AGENT_IMAGE
+ before_script:
+   # Setup Claude authentication from CI/CD variables
+   - mkdir -p ~/.claude
+   - |
+     if [ -n "$CLAUDE_CREDENTIALS" ]; then
+       echo "$CLAUDE_CREDENTIALS" > ~/.claude/.credentials.json
+     fi
  script:
    - ai-runner
```

---

## Step 5: Update Documentation (5 min)

**File**: `README.md`

Replace OpenCode sections with Claude Code:

```diff
### GitLab CI/CD Variables

-Provider API keys (one required):
-- OPENAI_API_KEY
-- ANTHROPIC_API_KEY
-  ... (10+ providers)
-
-Model configuration:
-- OPENCODE_MODEL: Provider/model format (e.g., anthropic/claude-sonnet-4)

+Authentication (one required):
+- ANTHROPIC_API_KEY: Your Anthropic API key
+  OR
+- CLAUDE_CREDENTIALS: File-type variable with ~/.claude/.credentials.json content
+
+Model configuration:
+- AI_MODEL: Model name (default: "sonnet")
+  Options: "sonnet", "opus", "haiku", or full ID like "claude-sonnet-4-20250514"
+
+Custom instructions (optional):
+- AI_INSTRUCTIONS: Custom system prompt appended to Claude's base prompt
```

---

## Step 6: Test Locally (10 min)

### Build Agent Image

```bash
cd agent-image
docker build -t agent-gitlab-test .
```

### Test Authentication Check

```bash
# Should fail with helpful message
docker run --rm agent-gitlab-test sh -c "node /opt/agent/ai-runner.js"

# Should succeed (if you have ~/.claude.json)
docker run --rm \
  -v ~/.claude.json:/home/developer/.claude.json:ro \
  -v ~/.claude:/home/developer/.claude:ro \
  agent-gitlab-test \
  sh -c "node /opt/agent/ai-runner.js"
```

### Test Claude Execution

Create test script:

```bash
docker run --rm \
  -e ANTHROPIC_API_KEY="your-key" \
  -e CI_COMMENT_BODY="@ai Say hello" \
  -e GITLAB_TOKEN="test" \
  agent-gitlab-test \
  sh -c "cd /opt/agent && node ai-runner.js"
```

Expected: Claude Code runs and outputs response.

---

## Step 7: Deploy & Verify (5 min)

### Publish Docker Image

```bash
docker tag agent-gitlab-test ghcr.io/yourusername/agent-for-gitlab/agent-image:latest
docker push ghcr.io/yourusername/agent-for-gitlab/agent-image:latest
```

### Set GitLab CI/CD Variables

In your GitLab project (Settings → CI/CD → Variables):

1. Add `CLAUDE_CREDENTIALS` (File type):
   - Copy your `~/.claude/.credentials.json` content
   - Mark as Masked

   OR

2. Add `ANTHROPIC_API_KEY`:
   - Your Anthropic API key
   - Mark as Masked

3. Add `AI_MODEL` (optional):
   - Value: `sonnet` (or preferred model)

### Trigger Test Pipeline

1. Create GitLab issue
2. Comment: `@ai Say hello and show you're using Claude Code`
3. Check pipeline logs for:
   - ✅ `Running Claude Code...`
   - ✅ `Claude Code completed`
   - ✅ Response from Claude mentioning it's Claude Code

---

## Rollback Plan

If issues arise:

1. **Revert Docker image**:
   ```bash
   docker pull ghcr.io/schickli/agent-for-gitlab/agent-image:previous-tag
   ```

2. **Update .gitlab-ci.yml**:
   ```diff
   - AI_AGENT_IMAGE: "ghcr.io/yourusername/..."
   + AI_AGENT_IMAGE: "ghcr.io/schickli/agent-for-gitlab/agent-image:opencode-version"
   ```

3. **Revert git commits**:
   ```bash
   git revert HEAD~3..HEAD  # Revert last 3 commits
   ```

---

## Troubleshooting

### "Claude Code CLI not found"
- **Cause**: Docker image build failed
- **Fix**: Check Dockerfile npm install line, rebuild image

### "Authentication not configured"
- **Cause**: CI/CD variables not set
- **Fix**: Add CLAUDE_CREDENTIALS or ANTHROPIC_API_KEY variable

### "Command failed with exit code 1"
- **Cause**: Various Claude Code errors
- **Fix**: Check pipeline logs for stderr output, verify model name

### "Invalid model"
- **Cause**: AI_MODEL set to unsupported value
- **Fix**: Use "sonnet", "opus", "haiku", or full model ID

---

## Success Criteria Checklist

- [ ] Docker image builds successfully
- [ ] `claude --version` works in container
- [ ] Authentication check catches missing credentials
- [ ] Pipeline runs with CLAUDE_CREDENTIALS variable
- [ ] Claude Code output appears in logs
- [ ] GitLab comments show Claude responses
- [ ] README documents Claude Code setup
- [ ] No OpenCode references remain in code

---

## Estimated Time

- Dockerfile: 5 min
- Code changes: 15 min
- CI/CD config: 3 min
- Documentation: 5 min
- Testing: 10 min
- Deploy: 5 min

**Total**: ~43 minutes (with testing)

---

## Next Steps

After completing these changes, proceed to `/speckit.tasks` to generate the detailed task breakdown for implementation.
