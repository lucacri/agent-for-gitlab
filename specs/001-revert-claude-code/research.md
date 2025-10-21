# Research: Revert to Claude Code from OpenCode

**Feature**: 001-revert-claude-code
**Date**: 2025-10-19
**Status**: Complete

## Overview

This document contains research findings to support reverting from OpenCode CLI to Claude Code CLI while preserving functional upgrades.

---

## Decision 1: Claude Code CLI Command Structure

**Context**: Need to understand correct Claude Code CLI arguments to replace OpenCode commands.

**Decision**: Use the following Claude Code CLI structure:
```bash
claude -p "prompt text" \
  --model sonnet \
  --append-system-prompt "custom instructions" \
  --allowedTools "Read" "Write" "Edit" "Bash"
```

**Rationale**:
- `-p` (print mode) runs headless without interactive UI - perfect for CI/CD
- `--model` accepts both short names ("sonnet", "opus") and full IDs ("claude-sonnet-4-20250514")
- `--append-system-prompt` adds custom instructions without replacing base prompt
- `--allowedTools` provides granular permission control (replaces OpenCode's permission system)

**Alternatives Considered**:
1. ~~`--permission-mode acceptEdits`~~ - This is an older approach; `--allowedTools` is more explicit
2. ~~`--dangerously-skip-permissions`~~ - Too permissive for automated CI environment

**Source**: Claude Code CLI official docs (https://docs.claude.com/en/docs/claude-code/cli-reference)

---

## Decision 2: Authentication via Volume Mounts

**Context**: Must support Claude Code subscription authentication without API keys.

**Decision**: Use GitLab CI/CD variables approach instead of volume mounts:

```yaml
before_script:
  - mkdir -p ~/.claude
  - |
    if [ -n "$CLAUDE_CREDENTIALS" ]; then
      echo "$CLAUDE_CREDENTIALS" > ~/.claude/.credentials.json
    fi
```

**Rationale**:
- Volume mounts require runner-level `config.toml` configuration - not portable across runners
- GitLab.com shared runners don't support host volume mounts
- File-type CI/CD variables are more portable and secure
- Users can store credentials as masked CI/CD variables

**Alternatives Considered**:
1. ~~Host volume mounts~~ - Rejected: Requires runner admin access, not portable, security risk on shared runners
2. ~~API key environment variables~~ - Rejected: User requested subscription-based auth, not API keys
3. **File-type CI/CD variable** - SELECTED: Portable, secure, works on all runners

**Implementation Details**:
- Users create CI/CD variable named `CLAUDE_CREDENTIALS` (type: File)
- Variable contains `~/.claude/.credentials.json` content
- Runner copies to `~/.claude/.credentials.json` before Claude Code execution
- Alternative: `ANTHROPIC_API_KEY` environment variable (fallback for API key users)

**Source**: GitLab CI/CD documentation on volume mounts and file variables

---

## Decision 3: Error Handling for Authentication Failures

**Context**: Need to detect missing/invalid credentials and provide helpful error messages.

**Decision**: Implement proactive credential checking with keyword-based error detection:

```javascript
function checkClaudeAuth() {
  const credPath = path.join(os.homedir(), '.claude', '.credentials.json');

  if (!fs.existsSync(credPath) && !process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      'Claude Code authentication not configured.\n' +
      'Set CI/CD variable: CLAUDE_CREDENTIALS (file type) or ANTHROPIC_API_KEY'
    );
  }
}

function detectAuthError(stderr) {
  const authKeywords = [
    'authentication failed',
    'unauthorized',
    'invalid credentials',
    'not authenticated'
  ];
  return authKeywords.some(kw => stderr.toLowerCase().includes(kw));
}
```

**Rationale**:
- Proactive checking prevents confusing error messages
- Keyword detection catches runtime auth failures
- Clear guidance helps users fix configuration issues
- Supports both subscription and API key auth methods

**Alternatives Considered**:
1. ~~Exit code only~~ - Rejected: Claude Code exit codes may not uniquely identify auth failures
2. ~~Regex patterns~~ - Rejected: Overkill for simple keyword matching
3. **Combined approach** - SELECTED: Proactive check + runtime keyword detection

**Source**: Node.js child_process best practices

---

## Decision 4: Model Selection Approach

**Context**: Need to map AI_MODEL variable to Claude Code model identifiers.

**Decision**: Support both short names and full model IDs with sensible defaults:

```javascript
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
```

**Rationale**:
- Claude Code accepts both short names ("sonnet") and full IDs ("claude-sonnet-4-20250514")
- Backwards compatible with existing AI_MODEL values
- Defaults to "sonnet" if not specified (most common use case)
- Allows users to specify exact model versions if needed

**Alternatives Considered**:
1. ~~Require full model IDs~~ - Rejected: Too verbose for users
2. ~~Only short names~~ - Rejected: Doesn't allow version pinning
3. **Hybrid approach** - SELECTED: Best of both worlds

**Source**: Claude Code model documentation

---

## Decision 5: Custom Prompt Injection

**Context**: Need to support AI_INSTRUCTIONS variable for custom system prompts.

**Decision**: Use `--append-system-prompt` flag with AI_INSTRUCTIONS variable:

```javascript
const args = [
  '-p', prompt,
  '--model', getClaudeModel(context.aiModel)
];

if (context.aiInstructions) {
  args.push('--append-system-prompt', context.aiInstructions);
}
```

**Rationale**:
- `--append-system-prompt` preserves Claude Code's base prompt while adding custom instructions
- Matches existing OpenCode behavior (OPENCODE_AGENT_PROMPT → AI_INSTRUCTIONS)
- Session-specific, doesn't require file changes
- Safe - doesn't allow replacing core system prompt

**Alternatives Considered**:
1. ~~CLAUDE.md files~~ - Rejected: Requires committing files to repo, not dynamic
2. ~~settings.json~~ - Rejected: Not per-pipeline configurable
3. **CLI flag** - SELECTED: Most flexible, matches OpenCode pattern

**Source**: Claude Code CLI reference for `--append-system-prompt`

---

## Decision 6: Permission Model

**Context**: OpenCode used `permission: { edit: "allow", bash: "allow" }` config. Need Claude Code equivalent.

**Decision**: Use `--allowedTools` with explicit tool list:

```javascript
const args = [
  '-p', prompt,
  '--model', getClaudeModel(context.aiModel),
  '--allowedTools', 'Read', 'Write', 'Edit', 'Bash', 'Grep', 'Glob'
];
```

**Rationale**:
- Explicit tool list matches security principle (fail-safe defaults)
- More granular than OpenCode's permission system
- Supports wildcard patterns if needed (e.g., "Bash(git *)")
- Defaults to requiring confirmation for unlisted tools

**Alternatives Considered**:
1. ~~`--dangerously-skip-permissions`~~ - Rejected: Too permissive for CI
2. ~~Per-tool wildcards~~ - Rejected: Overly complex for initial implementation
3. **Explicit tool list** - SELECTED: Clear, auditable, secure

**Source**: Claude Code permissions documentation

---

## Decision 7: Testing Approach

**Context**: No test framework detected in package.json. Need testing strategy.

**Decision**: Manual testing with pipeline verification:

1. **Unit Testing**: Add minimal tests with Node.js built-in `assert`:
   ```javascript
   // test/model-mapping.test.js
   import assert from 'assert';
   import { getClaudeModel } from '../src/claude.js';

   assert.strictEqual(getClaudeModel('sonnet'), 'sonnet');
   assert.strictEqual(getClaudeModel(undefined), 'sonnet');
   ```

2. **Integration Testing**: GitLab CI pipeline run with real @ai trigger

3. **Verification Checklist**:
   - [ ] Docker image builds with Claude Code CLI
   - [ ] `claude --version` succeeds in container
   - [ ] Pipeline executes with CLAUDE_CREDENTIALS variable
   - [ ] Claude Code produces output captured in logs
   - [ ] Error messages are helpful when credentials missing

**Rationale**:
- Minimal testing aligns with project's current maturity
- CI pipeline itself serves as integration test
- Manual verification sufficient for CLI tool wrapper
- Can add formal test framework later if needed

**Alternatives Considered**:
1. ~~Full Jest test suite~~ - Rejected: Overkill for ~200 LOC changes
2. ~~No tests~~ - Rejected: Need basic validation
3. **Lightweight tests + manual verification** - SELECTED: Proportional to change scope

---

## Decision 8: NPM Package Name

**Context**: Need correct npm package identifier for Claude Code CLI.

**Decision**: Use `@anthropic-ai/claude-code` (scoped package)

**Rationale**:
- Official Anthropic package (verified on npm registry)
- Latest version: 2.0.22+
- Provides `claude` binary in PATH
- Actively maintained by Anthropic

**Command**:
```dockerfile
RUN npm install -g @anthropic-ai/claude-code
```

**Alternatives Considered**:
1. ~~`claude-code`~~ - Rejected: Not the official package name
2. ~~`anthropic-cli`~~ - Rejected: Different tool
3. **`@anthropic-ai/claude-code`** - SELECTED: Official package

**Source**: npm registry (https://www.npmjs.com/package/@anthropic-ai/claude-code)

---

## Summary of Technical Decisions

| Component | OpenCode → Claude Code | Implementation |
|-----------|----------------------|----------------|
| **NPM Package** | `opencode-ai` → `@anthropic-ai/claude-code` | Dockerfile RUN command |
| **CLI Binary** | `opencode` → `claude` | runner.js spawn command |
| **Model Variable** | `OPENCODE_MODEL` → `AI_MODEL` | Context parsing + flag mapping |
| **Instructions** | `OPENCODE_AGENT_PROMPT` → `AI_INSTRUCTIONS` | `--append-system-prompt` flag |
| **Authentication** | Multi-provider keys → File variable | `CLAUDE_CREDENTIALS` CI/CD var |
| **Permissions** | JSON config → CLI flags | `--allowedTools` with explicit list |
| **Output Mode** | Single-turn → Print mode | `-p` flag (headless) |

---

## Open Questions

None - all technical unknowns resolved through research.

---

## References

1. Claude Code CLI Reference: https://docs.claude.com/en/docs/claude-code/cli-reference
2. Claude Code Authentication: https://claudelog.com/configuration/
3. GitLab CI Volume Mounts: GitLab Runner configuration documentation
4. Node.js child_process: Official Node.js documentation
5. npm @anthropic-ai/claude-code: https://www.npmjs.com/package/@anthropic-ai/claude-code
