# Implementation Plan: Revert to Claude Code from OpenCode

**Branch**: `001-revert-claude-code` | **Date**: 2025-10-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-revert-claude-code/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Revert the GitLab AI agent from OpenCode CLI to Claude Code CLI, replacing `npm install -g opencode-ai` with `npm install -g @anthropic-ai/claude-code` and updating the runner script to execute `claude` commands instead of `opencode` commands. Authentication switches from multi-provider API keys to Claude Code subscription via volume-mounted ~/.claude.json and ~/.claude folder. Preserve infrastructure upgrades (Node.js 24.x, .NET SDK 8, improved logging). No backwards compatibility required.

## Technical Context

**Language/Version**: Node.js 24.x (ESM modules)
**Primary Dependencies**: @anthropic-ai/claude-code (CLI), @modelcontextprotocol/sdk, zod, tsx
**Storage**: N/A (stateless CI pipeline execution)
**Testing**: NEEDS CLARIFICATION (no test framework detected in package.json)
**Target Platform**: Docker container (Linux) running in GitLab CI/CD runners
**Project Type**: Multi-project (gitlab-app webhook server + agent-image Docker image with runner scripts)
**Performance Goals**: Claude Code CLI execution completes within GitLab CI timeout limits (typically 1-2 hours)
**Constraints**: Must work within GitLab CI isolated environment; must support volume mounts for ~/.claude authentication; no external network calls except to GitLab API and Claude services
**Scale/Scope**: 3 main files to modify (Dockerfile, runner.js, .gitlab-ci.yml), ~200 lines of code changes, documentation updates

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Security-First Architecture
✅ **COMPLIANT**: Changes maintain pipeline isolation - Claude Code runs in same isolated CI runner as OpenCode did. Branch protection mechanisms remain unchanged. No new security surface area introduced.

### Modular Integration Layer
✅ **COMPLIANT**: Switching from OpenCode CLI to Claude Code CLI maintains clean interface boundaries. Runner script already abstracts CLI execution into separate module (opencode.js → will become claude.js). No webhook handling changes required.

### Fail-Safe Defaults
✅ **COMPLIANT**: Rate limiting, branch creation failures, and pipeline cancellation logic are unchanged. These operate at webhook app level, independent of the AI CLI provider.

### Observability & Context Preservation
✅ **COMPLIANT**: Pipeline logging, GitLab comment updates, and audit trails remain intact. Claude Code CLI output will be captured same way OpenCode output was captured.

### Configuration Clarity
⚠️ **REQUIRES ATTENTION**: Need to update environment variable documentation. Removing OPENCODE_MODEL/OPENCODE_AGENT_PROMPT and replacing with AI_MODEL/AI_INSTRUCTIONS. Volume mount configuration must be clearly documented.

### Docker-First Deployment
✅ **COMPLIANT**: Changes are Docker-native. Agent image rebuilds with new npm package. Volume mounts for ~/.claude follow standard Docker patterns.

### Multi-Provider LLM Support
❌ **VIOLATION**: Removing multi-provider support by switching to Claude-only authentication.

**Justification**: User explicitly requested Claude Code exclusively with no backwards compatibility. Constitution's multi-provider principle conflicts with feature requirement. This is an intentional architectural decision to simplify authentication and align with user's preference for Claude Code subscription model.

### Repository Protection Policy
✅ **COMPLIANT**: Branch creation and protection logic unchanged.

### Rate Limiting & Resource Management
✅ **COMPLIANT**: Rate limiting operates at webhook app level, independent of AI provider.

**GATE RESULT**: ⚠️ CONDITIONAL PASS - One justified violation (Multi-Provider LLM Support removal). Proceed with Phase 0.

## Project Structure

### Documentation (this feature)

```
specs/001-revert-claude-code/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command) - N/A for this feature
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command) - N/A for this feature
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
agent-for-gitlab/
├── agent-image/
│   ├── Dockerfile                    # MODIFY: Replace opencode with @anthropic-ai/claude-code
│   └── scripts/
│       ├── package.json              # MODIFY: Update dependencies
│       └── src/
│           ├── ai-runner.js          # Entry point (no changes)
│           ├── runner.js             # MODIFY: Remove OpenCode-specific logic
│           ├── opencode.js           # REPLACE: Rename/rewrite as claude.js
│           ├── config.js             # MODIFY: Remove multi-provider key validation
│           ├── context.js            # No changes
│           ├── gitlab.js             # No changes
│           ├── git.js                # No changes
│           ├── logger.js             # No changes
│           └── output.js             # No changes
│
├── gitlab-app/                        # Webhook server (minimal changes)
│   └── (webhook server files)        # No changes to webhook logic
│
├── gitlab-utils/
│   └── .gitlab-ci.yml                # MODIFY: Update variable names and docs
│
└── README.md                          # MODIFY: Update documentation
```

**Structure Decision**: Multi-project layout with agent-image (Docker image with runner) and gitlab-app (webhook server). Changes concentrated in agent-image/* with documentation updates in root README.md and gitlab-utils/.gitlab-ci.yml.

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Multi-Provider LLM Support removal | User explicitly requested Claude Code exclusively with no backwards compatibility. Simplifies authentication from 10+ provider keys to single subscription model via volume mounts. | Keeping multi-provider support would require maintaining both OpenCode and Claude Code paths, contradicting user requirement for "Claude Code exclusively". Hybrid approach adds complexity user explicitly rejected. |

---

## Post-Design Constitution Re-evaluation

*Re-checked after Phase 1 design (research.md, quickstart.md complete)*

### Configuration Clarity
✅ **NOW COMPLIANT**: Documentation clearly defines:
- `AI_MODEL` - Model selection (replaces OPENCODE_MODEL)
- `AI_INSTRUCTIONS` - Custom prompts (replaces OPENCODE_AGENT_PROMPT)
- `CLAUDE_CREDENTIALS` / `ANTHROPIC_API_KEY` - Authentication (replaces 10+ provider keys)

README.md updated with explicit variable namespace and usage examples.

### Multi-Provider LLM Support
❌ **STILL VIOLATED** (justified): Design confirms Claude-only authentication. Decision documented in research.md with rationale.

**FINAL GATE RESULT**: ✅ PASS - All principles compliant or violations justified. Ready for Phase 2 (tasks generation).
