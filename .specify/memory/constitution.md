# Agent for GitLab Constitution

<!--
SYNC IMPACT REPORT
==================
Version change: NONE → 1.0.0
Modified principles: N/A (initial constitution)
Added sections: All sections (initial creation)
Removed sections: None

Templates requiring updates:
✅ .specify/templates/plan-template.md - Reviewed (constitution check section compatible)
✅ .specify/templates/spec-template.md - Reviewed (requirements align)
✅ .specify/templates/tasks-template.md - Reviewed (task categorization compatible)

Follow-up TODOs:
- RATIFICATION_DATE needs to be confirmed by project owner
-->

## Core Principles

### I. Security-First Architecture

All agent operations MUST execute in isolated GitLab CI/CD runners. The system MUST prevent unauthorized access to protected branches through fail-safe branch creation mechanisms. Personal Access Tokens MUST be stored securely in CI/CD variables, never in source code or logs.

**Rationale**: As a system that executes AI-generated code changes with repository write access, security is non-negotiable. Pipeline isolation ensures blast radius containment; branch protection prevents accidental damage to production code.

### II. Modular Integration Layer

GitLab webhook handling, pipeline triggering, and agent execution MUST remain decoupled through clear interfaces. The agent runner MUST support pluggable MCP (Model Context Protocol) servers and multiple LLM providers via the opencode CLI without core logic changes.

**Rationale**: This project integrates multiple external systems (GitLab, various LLM providers, MCP servers). Tight coupling would make provider swaps, testing, and feature additions prohibitively expensive. Modularity enables independent evolution of webhook handling, agent logic, and LLM backends.

### III. Fail-Safe Defaults

Rate limiting MUST be enabled by default. Branch creation failures MUST halt execution—never fall back to main/default branches. Pipeline cancellation for older pending runs MUST occur automatically unless explicitly disabled.

**Rationale**: AI agents with write access present operational risks. Conservative defaults protect users from runaway costs, accidental overwrites, and pipeline queue saturation while still allowing power users to opt into more permissive modes.

### IV. Observability & Context Preservation

All agent operations MUST log to pipeline output for audit trails. Comment threads MUST be captured as context for the agent. Progress updates MUST be reflected in GitLab comments with emoji reactions (e.g., "In Progress..." notification).

**Rationale**: Debugging AI behavior requires full context visibility. Users need real-time feedback on long-running agent tasks. Audit trails are essential for understanding what the agent did and why.

### V. Configuration Clarity

Environment variables MUST follow a clear namespace (`OPENCODE_*`, `GITLAB_*`, `AI_*`). The distinction between webhook app configuration (base prompts, GitLab URL) and pipeline configuration (API keys, custom prompts) MUST remain explicit in documentation and code.

**Rationale**: This system has two deployment surfaces (webhook app + CI pipeline) with overlapping concerns. Ambiguous config leads to deployment errors and security issues (e.g., leaking tokens in the wrong place).

### VI. Docker-First Deployment

The agent image MUST be buildable and publishable to standard registries. The webhook app MUST be runnable via `docker-compose` with minimal `.env` setup. No hardcoded assumptions about host environments are permitted.

**Rationale**: GitLab CI runners vary widely. Containerization ensures reproducible execution regardless of runner configuration. Docker Compose simplifies local development and testing.

## Operational Constraints

### Repository Protection Policy

- **Main/Default Branch Execution**: FORBIDDEN—all agent operations MUST occur on feature branches created with the format `{BRANCH_PREFIX}/issue-{IID}-{title}-{timestamp}` or on existing MR source branches.
- **Branch Naming**: MUST include timestamp for uniqueness; MUST be derived from issue/MR metadata to ensure traceability.
- **Protected Branch Handling**: If branch creation fails (e.g., naming collision, permission error), the pipeline MUST abort with a clear error message—no fallback to default branch.

**Rationale**: Protected branches exist to enforce code review and quality gates. Allowing agent execution on these branches would bypass organizational safeguards and create unacceptable risk.

### Rate Limiting & Resource Management

- **Default Rate Limiting**: ENABLED unless `RATE_LIMITING_ENABLED=false` explicitly set.
- **Pipeline Cancellation**: Old pending pipelines for the same comment/issue MUST be canceled automatically when `CANCEL_OLD_PIPELINES=true` (default).
- **Redis Requirement**: Redis is required only when rate limiting is enabled; omitting rate limiting removes this dependency.

**Rationale**: AI agents can be expensive and slow. Rate limiting prevents abuse and cost overruns. Pipeline cancellation prevents queue saturation from repeated trigger comments.

### Multi-Provider LLM Support

- **Model Selection**: Controlled via `OPENCODE_MODEL` in `provider/model` format (e.g., `azure/gpt-4.1`, `anthropic/claude-sonnet-4`).
- **API Key Management**: Provider-specific keys (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc.) MUST be stored as masked GitLab CI/CD variables.
- **Agent Image**: MUST include the opencode CLI and support all opencode-compatible providers without recompilation.

**Rationale**: Vendor lock-in to a single LLM provider is unacceptable. Different use cases require different models (cost, speed, capability trade-offs). The opencode abstraction enables experimentation and migration without architectural changes.

## Development Workflow

### Webhook Integration Contract

- **Trigger Detection**: The webhook app MUST listen for GitLab comment events containing the configurable `TRIGGER_PHRASE` (default: `@ai`).
- **Pipeline Creation**: MUST trigger a new GitLab pipeline with all required context variables (`COMMENT_ID`, `COMMENT_THREAD`, `ISSUE_IID`, `MR_IID`, etc.).
- **Status Updates**: MUST post an "In Progress..." comment immediately upon pipeline creation; MUST update with emoji reactions based on pipeline state.

**Rationale**: The webhook app is the orchestration hub. Latency in status updates leads to user confusion. Clear contracts prevent race conditions and ensure the agent receives necessary context.

### Agent Execution Contract

- **Input**: Agent MUST receive context via environment variables (`COMMENT_THREAD`, `CUSTOM_AGENT_PROMPT`, `OPENCODE_MODEL`, etc.).
- **Output**: Agent MUST post final results as GitLab comments; MUST commit changes to the current feature branch; MUST handle MCP server initialization if configured.
- **Error Handling**: Failures MUST be logged in pipeline output and reported in GitLab comments—silent failures are forbidden.

**Rationale**: The agent runs in an ephemeral CI environment. All inputs and outputs must be serializable and traceable. Users should never have to inspect pipeline logs to understand what the agent did.

### MCP Server Integration

- **Configuration**: MCP server configurations MUST be defined in the agent image or via environment variables (future enhancement planned per roadmap).
- **Lifecycle**: Servers MUST be started before agent execution and shut down afterward; zombie processes are unacceptable.
- **Error Isolation**: MCP server failures MUST not crash the agent—degraded functionality is acceptable if the core task can still proceed.

**Rationale**: MCP servers provide additional capabilities (e.g., Jira integration, Sonar analysis) but are not always required. Tight coupling would make testing harder and reduce reliability.

## Quality Gates

### Pre-Commit Verification

- Configuration MUST NOT include protected CI/CD variables in unprotected pipelines.
- Secrets MUST NOT appear in pipeline logs or commit messages.
- Docker images MUST be tagged with commit SHAs for reproducibility.

### Testing Requirements

- Webhook endpoint MUST have health check (`GET /health`).
- Admin endpoints MUST require `ADMIN_TOKEN` authentication.
- Agent prompts MUST be testable by injecting `CUSTOM_AGENT_PROMPT` without redeploying the webhook app.

### Documentation Standards

- All environment variables MUST be documented in README with type, default value, and examples.
- Architecture diagrams MUST be kept up-to-date when adding new components (e.g., new MCP servers).
- Roadmap items MUST be marked with checkboxes to track completion status.

## Governance

### Amendment Process

1. Propose changes via GitLab issue describing the rationale and impact.
2. Update this constitution file with clear version bump justification.
3. Propagate changes to dependent templates (plan-template.md, spec-template.md, tasks-template.md).
4. Update README and diagrams if external behavior changes.
5. Obtain approval from project maintainer before merge.

### Version Semantics

- **MAJOR**: Backward-incompatible changes to environment variables, webhook contracts, or agent execution model.
- **MINOR**: New principles, new optional features (e.g., new MCP server support), or expanded guidance.
- **PATCH**: Clarifications, typo fixes, formatting improvements.

### Compliance Verification

- All merge requests MUST verify compliance with Security-First Architecture (branch isolation, no token exposure).
- All new features MUST document required environment variables and update `.env.example`.
- Complexity MUST be justified—prefer simple solutions over abstract frameworks unless scale demands otherwise.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): Awaiting project owner confirmation | **Last Amended**: 2025-10-19
