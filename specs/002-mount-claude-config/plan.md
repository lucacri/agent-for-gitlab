# Implementation Plan: Optional Claude Configuration Mounting

**Branch**: `002-mount-claude-config` | **Date**: 2025-10-22 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-mount-claude-config/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Enable optional Claude configuration mounting in the agent-image container to allow users to mount their host `~/.claude/` folder and a config directory containing `.claude.json`. An entrypoint script will copy `.claude.json` to `/root/.claude.json` at container startup with strict error handling, while maintaining full backward compatibility with existing authentication methods (environment variables and pre-existing credentials).

## Technical Context

**Language/Version**: Shell script (sh/bash) for entrypoint, Dockerfile syntax for container configuration
**Primary Dependencies**: Docker base image (php:8.4-cli), existing Claude Code CLI installation, shell utilities (cp, test, exec)
**Storage**: N/A - configuration files only (no persistent database)
**Testing**: Docker container integration tests (startup validation, authentication verification, error handling, backward compatibility)
**Target Platform**: Docker containers on Linux (GitLab CI/CD runners, local development)
**Project Type**: single (modifying existing agent-image Docker image)
**Performance Goals**: Container startup must complete within 5 seconds including configuration copy (SC-002)
**Constraints**: 100% backward compatibility with existing deployments (SC-003), strict error handling with immediate failure on invalid config (FR-005), zero breaking changes to docker run commands (SC-006)
**Scale/Scope**: Single Docker image modification (agent-image only), 1 entrypoint script (~20-30 lines), 4 documentation files to update

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Compliance Analysis

✅ **I. Security-First Architecture**
- **Alignment**: Feature handles authentication credentials and configuration files with security in mind
- **Evidence**: FR-005 requires strict error handling (fail fast on unreadable configs), documentation will recommend read-only mounts (`:ro` flag), no secrets logged to stdout
- **Action Required**: Entrypoint script must not echo credential contents; document security best practices for file permissions on host

✅ **II. Modular Integration Layer**
- **Alignment**: Feature maintains decoupled design - entrypoint script is independent of agent runner logic
- **Evidence**: FR-009 requires preserving all command-line arguments via `exec "$@"`, entrypoint only handles configuration setup before delegating to original command
- **Action Required**: None - design naturally decoupled

✅ **III. Fail-Safe Defaults**
- **Alignment**: Feature is entirely optional with fail-safe behavior
- **Evidence**: FR-006 specifies container proceeds normally if /claude-config not mounted, FR-007 preserves all existing authentication methods as fallbacks
- **Action Required**: None - design is fail-safe by default

✅ **IV. Observability & Context Preservation**
- **Alignment**: Feature provides clear logging and error messages
- **Evidence**: FR-008 requires clear error messages with specific failure reasons, entrypoint will output progress messages
- **Action Required**: Ensure entrypoint logs are visible in docker logs and pipeline output

✅ **V. Configuration Clarity**
- **Alignment**: Feature follows clear conventions with explicit documentation
- **Evidence**: Mount points use clear paths (/claude-config, /root/.claude), authentication priority order explicitly documented (FR-007)
- **Action Required**: Update README with detailed mount examples, document authentication precedence, add troubleshooting guide

✅ **VI. Docker-First Deployment**
- **Alignment**: Feature is Docker-native by design
- **Evidence**: Uses standard Docker volume mounts, no host-specific assumptions, compatible with docker-compose and GitLab CI/CD
- **Action Required**: Provide docker-compose.yml examples and GitLab CI/CD integration patterns

### Operational Constraints Check

✅ **Repository Protection Policy**: N/A - feature does not modify GitLab branch handling

✅ **Rate Limiting & Resource Management**: N/A - feature does not impact rate limiting or pipeline management

✅ **Multi-Provider LLM Support**: N/A - feature is provider-agnostic, works with existing opencode CLI integration

### Quality Gates Check

✅ **Pre-Commit Verification**:
- Entrypoint script must not log credentials
- Documentation must warn against mounting credentials in unprotected pipelines
- Docker image tagging follows existing conventions (commit SHA)

✅ **Testing Requirements**:
- Container must start successfully without mounts (backward compatibility)
- Container must fail cleanly with mounted but unreadable config (error handling)
- Container must authenticate successfully with mounted config (functionality)

✅ **Documentation Standards**:
- Mount point paths must be documented in README
- Architecture diagrams may need update to show entrypoint flow
- Environment variables section must note authentication precedence

**GATE RESULT**: ✅ PASSED - All constitution principles satisfied, no violations to justify

## Project Structure

### Documentation (this feature)

```
specs/002-mount-claude-config/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command) - N/A for this feature
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command) - N/A for this feature
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
agent-image/
├── Dockerfile           # MODIFY: Add entrypoint script copy and set ENTRYPOINT
├── entrypoint.sh        # CREATE: New entrypoint script for config mounting
├── README.md            # MODIFY: Add configuration mounting documentation
└── scripts/             # Existing agent scripts (no changes)

README.md                # MODIFY: Add Docker configuration section

docs/                    # OPTIONAL: Architecture diagrams may need update
```

**Structure Decision**: This is a modification to the existing agent-image Docker container. The primary changes are:
1. New `agent-image/entrypoint.sh` script (~20-30 lines of shell code)
2. Modified `agent-image/Dockerfile` (~7 lines added for entrypoint setup)
3. Documentation updates in `agent-image/README.md` (~100 lines) and root `README.md` (~40 lines)

No changes to backend/, frontend/, or other project areas. This is a standalone infrastructure improvement to the agent container image.

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

No violations detected - section not applicable.

