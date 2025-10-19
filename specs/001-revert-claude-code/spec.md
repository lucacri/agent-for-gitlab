# Feature Specification: Revert to Claude Code from OpenCode

**Feature Branch**: `001-revert-claude-code`
**Created**: 2025-10-19
**Status**: Draft
**Input**: User description: "this is a fork of a project that was doing great, but unfortunately in the commit 3ae372b8d5745d9d0170575758174525dd273ca1 they decided to switch from claude code to opencode. I want \"convert back\" this repository to use claude code exclusively, while keeping the upgrades that they introduced (as long as they still function/make sense)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Restore Claude Code CLI Integration (Priority: P1)

The system uses Claude Code as its AI code assistant instead of OpenCode, enabling GitLab webhook triggers to run Claude Code commands when @ai is mentioned in issues and merge requests.

**Why this priority**: This is the core change requested - reverting to Claude Code is the primary objective. Without this change, none of the other improvements matter since the fundamental AI engine would remain OpenCode.

**Independent Test**: Can be fully tested by triggering the @ai mention in a GitLab issue and verifying that the pipeline executes Claude Code CLI commands instead of OpenCode CLI commands. Success is confirmed when pipeline logs show `claude` commands running and Claude Code authentication is used.

**Acceptance Scenarios**:

1. **Given** a GitLab issue with @ai mention, **When** the webhook triggers the pipeline, **Then** the pipeline executes using Claude Code CLI (not OpenCode)
2. **Given** the agent Docker image, **When** inspecting installed packages, **Then** @anthropic-ai/claude-code npm package is present (not opencode)
3. **Given** Claude Code subscription credentials mounted as volumes, **When** the pipeline runs, **Then** authentication uses mounted ~/.claude.json and ~/.claude folder (not multi-provider API keys)

---

### User Story 2 - Preserve Agent Image Base Configuration (Priority: P2)

The agent Docker image retains modern base image versions (Node.js 24.x, .NET SDK 8) and essential CLI tools (git, curl, jq) that were part of the upgraded version.

**Why this priority**: These are valuable improvements from the newer version that don't conflict with reverting to Claude Code. They represent infrastructure modernization that should be preserved.

**Independent Test**: Can be tested by building the agent Docker image and verifying Node.js version (24.x), .NET SDK version (8), and availability of git, curl, and jq commands.

**Acceptance Scenarios**:

1. **Given** the agent Dockerfile, **When** building the image, **Then** Node.js version 24.x is installed
2. **Given** the agent Dockerfile, **When** building the image, **Then** .NET SDK 8 is installed
3. **Given** the running agent container, **When** checking for CLI tools, **Then** git, curl, and jq are available

---

### User Story 3 - Maintain Enhanced Documentation Structure (Priority: P3)

Documentation reflects Claude Code configuration while preserving improved formatting, clarity enhancements, and organizational improvements from the upgraded version.

**Why this priority**: Documentation improvements make the system easier to understand and use, but are lower priority than functional changes. They should be updated to reflect Claude Code while keeping structural improvements.

**Independent Test**: Can be tested by reviewing README.md and verifying it documents Claude Code setup (volume mount authentication, claude CLI usage) while maintaining the clearer formatting and organizational structure.

**Acceptance Scenarios**:

1. **Given** the README.md file, **When** reviewing authentication documentation, **Then** volume mount instructions for ~/.claude.json and ~/.claude are documented (not multi-provider API keys)
2. **Given** the README.md file, **When** reviewing pipeline configuration, **Then** AI_MODEL variable references Claude models (like "sonnet")
3. **Given** the README.md file, **When** reviewing overall structure, **Then** improved formatting and organization from newer version is preserved

---

### Edge Cases

- What happens when ~/.claude.json or ~/.claude folder is not mounted in the container?
- How does the system handle Claude Code model selection if AI_MODEL is not specified?
- What happens when the mounted Claude subscription credentials are invalid or expired?
- How does the system respond when Claude Code CLI encounters an error during execution?

### Assumptions

- This is treated as a clean reversion with **no backwards compatibility** requirements
- All OpenCode-specific code, configuration, and environment variables can be completely removed without migration support
- Users are expected to configure Claude Code subscription authentication from scratch (no migration from API key-based auth)
- The system does not need to support mixed OpenCode/Claude Code deployments or gradual migration paths

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST use Claude Code CLI (@anthropic-ai/claude-code npm package) instead of OpenCode CLI
- **FR-002**: System MUST authenticate via Claude Code subscription by mounting ~/.claude.json and ~/.claude folder as volumes in the container (not via environment variable API keys)
- **FR-003**: Pipeline MUST execute `claude` commands with appropriate arguments (--model, -p, --permission-mode, etc.)
- **FR-004**: Agent Docker image MUST install @anthropic-ai/claude-code via npm (not opencode package)
- **FR-005**: Runner script MUST accept AI_MODEL variable for Claude model selection (e.g., "sonnet")
- **FR-006**: Runner script MUST support AI_INSTRUCTIONS variable for custom Claude Code system prompts
- **FR-007**: System MUST remove OpenCode-specific configuration (OPENCODE_MODEL, OPENCODE_AGENT_PROMPT variables)
- **FR-008**: System MUST remove OpenCode configuration file generation (.opencode.ci.json)
- **FR-009**: System MUST preserve Node.js 24.x and .NET SDK 8 base image configuration
- **FR-010**: System MUST preserve essential CLI tools (git, curl, jq) in agent image
- **FR-011**: Documentation MUST reflect Claude Code authentication and configuration
- **FR-012**: Documentation MUST preserve formatting and structural improvements from upgraded version
- **FR-013**: System MUST remove Azure OpenAI and Bedrock-specific environment variable checks
- **FR-014**: System MUST use Claude Code's native permission handling (--permission-mode acceptEdits)
- **FR-015**: Runner script MUST remove API key validation logic (checks for ANTHROPIC_API_KEY, OPENAI_API_KEY, etc.) and rely on Claude Code's volume-mounted authentication

### Key Entities

- **Agent Docker Image**: Container image that provides the runtime environment with Claude Code CLI, Node.js 24.x, .NET SDK 8, and essential tools (git, curl, jq)
- **Runner Script**: Node.js module that orchestrates Claude Code execution, handles GitLab interactions, manages git operations, and posts results back to GitLab
- **Pipeline Configuration**: GitLab CI/CD YAML defining the AI agent job with environment variables (AI_MODEL, AI_INSTRUCTIONS) and volume mounts for Claude Code authentication (~/.claude.json, ~/.claude)
- **GitLab Webhook Context**: Information about the triggered comment/issue including project ID, issue IID, comment body, and authentication details
- **Claude Subscription Credentials**: Volume-mounted files (~/.claude.json and ~/.claude folder) containing Claude Code subscription authentication data

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: When @ai is mentioned in GitLab issues, pipeline logs show `claude` CLI commands executing (not `opencode`)
- **SC-002**: Agent Docker image builds successfully with @anthropic-ai/claude-code package installed and verifies installation with `claude --version`
- **SC-003**: Pipeline executes successfully using Claude Code subscription credentials via volume mounts (multi-provider API keys are not required)
- **SC-004**: Documentation clearly guides users to mount ~/.claude.json and ~/.claude folder instead of configuring multiple provider API keys (reduction from 10+ environment variables to 2 volume mounts)
- **SC-005**: All OpenCode-specific code and configuration is removed while preserving functional improvements (Node.js 24.x, .NET SDK 8, improved logging)
- **SC-006**: Existing GitLab webhook functionality continues working without regression (branch creation, comment posting, git operations remain functional)
