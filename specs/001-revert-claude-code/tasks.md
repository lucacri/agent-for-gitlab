# Tasks: Revert to Claude Code from OpenCode

**Input**: Design documents from `/specs/001-revert-claude-code/`
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: No formal tests requested - validation via manual pipeline verification

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- Multi-project layout: `agent-image/`, `gitlab-app/`, `gitlab-utils/`, `README.md`
- Agent runner scripts: `agent-image/scripts/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Repository preparation and cleanup

- [x] T001 Create backup of current OpenCode configuration for rollback reference
- [x] T002 [P] Verify Node.js 24.x and .NET SDK 8 are present in current agent-image/Dockerfile
- [x] T003 [P] Review commit 3ae372b8d5745d9d0170575758174525dd273ca1 diff to identify all OpenCode changes

---

## Phase 2: Foundational (No Blocking Prerequisites)

**Purpose**: This feature has no blocking foundational work - can proceed directly to user stories

**⚠️ NOTE**: Unlike typical features, this reversion has no shared infrastructure tasks. Each user story is independently implementable.

**Checkpoint**: Can proceed directly to User Story 1

---

## Phase 3: User Story 1 - Restore Claude Code CLI Integration (Priority: P1) 🎯 MVP

**Goal**: Replace OpenCode CLI with Claude Code CLI, update runner script to execute `claude` commands with proper authentication and arguments

**Independent Test**: Trigger @ai mention in GitLab issue → pipeline logs show `claude` CLI commands executing → Claude Code produces output → changes committed to branch

### Implementation for User Story 1

- [x] T004 [P] [US1] Update agent-image/Dockerfile to replace `npm install -g opencode-ai` with `npm install -g @anthropic-ai/claude-code`
- [x] T005 [P] [US1] Rename agent-image/scripts/src/opencode.js to agent-image/scripts/src/claude.js
- [x] T006 [US1] Rewrite agent-image/scripts/src/claude.js with checkClaudeAuth(), getClaudeModel(), and runClaude() functions per research.md Decision 1-6
- [x] T007 [US1] Update agent-image/scripts/src/runner.js to import from claude.js instead of opencode.js
- [x] T008 [US1] Update agent-image/scripts/src/runner.js to call checkClaudeAuth() before Claude execution
- [x] T009 [US1] Update agent-image/scripts/src/runner.js to call runClaude() instead of runOpencode()
- [x] T010 [US1] Update agent-image/scripts/src/config.js to remove multi-provider API key validation (remove checks for OPENAI_API_KEY, GROQ_API_KEY, etc.)
- [ ] T011 [US1] Update agent-image/scripts/src/context.js to replace opencodeModel/opencodeAgentPrompt with aiModel/aiInstructions variables
- [x] T012 [US1] Remove OpenCode configuration file generation logic (.opencode.ci.json) from agent-image/scripts/src/runner.js if present
- [x] T013 [US1] Remove Azure OpenAI and Bedrock environment variable checks from agent-image/scripts/src/config.js
- [ ] T014 [US1] Build Docker image locally: `cd agent-image && docker build -t agent-test .`
- [ ] T015 [US1] Verify Claude Code CLI installed: `docker run --rm agent-test claude --version`
- [ ] T016 [US1] Test authentication check with missing credentials: `docker run --rm agent-test sh -c "node /opt/agent/ai-runner.js"` (should fail with helpful message)
- [ ] T017 [US1] Update gitlab-utils/.gitlab-ci.yml to replace OPENCODE_MODEL variable with AI_MODEL
- [ ] T018 [US1] Update gitlab-utils/.gitlab-ci.yml to replace OPENCODE_AGENT_PROMPT variable with AI_INSTRUCTIONS
- [ ] T019 [US1] Add before_script to gitlab-utils/.gitlab-ci.yml to setup ~/.claude authentication from CLAUDE_CREDENTIALS variable per research.md Decision 2
- [ ] T020 [US1] Remove OpenCode-specific comments and variable documentation from gitlab-utils/.gitlab-ci.yml

**Checkpoint**: At this point, User Story 1 should be fully functional - Claude Code CLI replaces OpenCode, authentication works, pipeline executes successfully

---

## Phase 4: User Story 2 - Preserve Agent Image Base Configuration (Priority: P2)

**Goal**: Verify and document that Node.js 24.x, .NET SDK 8, and essential CLI tools (git, curl, jq) are preserved in the agent image

**Independent Test**: Build agent Docker image → inspect Node.js version → inspect .NET SDK version → verify git, curl, jq availability

### Implementation for User Story 2

- [ ] T021 [P] [US2] Verify agent-image/Dockerfile base image is dotnetimages/microsoft-dotnet-core-sdk-nodejs:8.0_24.x
- [ ] T022 [P] [US2] Verify agent-image/Dockerfile installs git, curl, jq, unzip via apt-get
- [ ] T023 [US2] Test Node.js version in container: `docker run --rm agent-test node --version` (should show v24.x)
- [ ] T024 [US2] Test .NET SDK version in container: `docker run --rm agent-test dotnet --version` (should show 8.x)
- [ ] T025 [US2] Test git availability: `docker run --rm agent-test git --version`
- [ ] T026 [US2] Test curl availability: `docker run --rm agent-test curl --version`
- [ ] T027 [US2] Test jq availability: `docker run --rm agent-test jq --version`
- [ ] T028 [US2] Document preserved infrastructure in specs/001-revert-claude-code/plan.md if not already noted

**Checkpoint**: At this point, User Story 2 is complete - all infrastructure upgrades are verified and preserved

---

## Phase 5: User Story 3 - Maintain Enhanced Documentation Structure (Priority: P3)

**Goal**: Update README.md and other documentation to reflect Claude Code configuration while preserving improved formatting from the upgraded version

**Independent Test**: Review README.md → verify Claude Code authentication documented → verify AI_MODEL variable documented → verify formatting improvements preserved

### Implementation for User Story 3

- [ ] T029 [US3] Update README.md authentication section to document CLAUDE_CREDENTIALS and ANTHROPIC_API_KEY (remove multi-provider API key docs)
- [ ] T030 [US3] Update README.md to document AI_MODEL variable with Claude model options ("sonnet", "opus", "haiku")
- [ ] T031 [US3] Update README.md to document AI_INSTRUCTIONS variable for custom system prompts
- [ ] T032 [US3] Update README.md to show GitLab CI/CD variable setup with masked CLAUDE_CREDENTIALS (file type)
- [ ] T033 [US3] Update README.md to remove OpenCode-specific sections (OPENCODE_MODEL, provider list with 10+ keys)
- [ ] T034 [US3] Update README.md agent image reference from OpenCode to Claude Code in description/title
- [ ] T035 [US3] Preserve improved markdown formatting (bullet lists, code blocks, section organization) from current README.md
- [ ] T036 [US3] Update README.md roadmap item "Add option to switch between claude and opencode" to mark as complete or remove
- [ ] T037 [US3] Review and update any inline code comments in agent-image/scripts/src/ mentioning OpenCode
- [ ] T038 [US3] Update agent-image/Dockerfile LABEL descriptions to reference Claude Code instead of OpenCode

**Checkpoint**: All user stories complete - documentation updated, Claude Code fully integrated, infrastructure preserved

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [ ] T039 [P] Run full end-to-end test: Create GitLab issue → comment "@ai Say hello" → verify pipeline success
- [ ] T040 [P] Verify pipeline logs show "Running Claude Code..." and "Claude Code completed" messages
- [ ] T041 [P] Verify no "opencode" references remain in codebase: `grep -r "opencode" agent-image/ gitlab-utils/ README.md`
- [ ] T042 [P] Verify no OpenCode npm package references: `grep -r "opencode-ai" agent-image/`
- [ ] T043 Commit all changes with message: "Revert to Claude Code from OpenCode - preserve infrastructure upgrades"
- [ ] T044 Run quickstart.md validation steps from specs/001-revert-claude-code/quickstart.md
- [ ] T045 Document rollback procedure in specs/001-revert-claude-code/quickstart.md if not already present
- [ ] T046 Tag Docker image with new version: `docker tag agent-test ghcr.io/USERNAME/agent-for-gitlab/agent-image:claude-code`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Not applicable - no blocking work
- **User Stories (Phase 3-5)**: Can proceed immediately after Setup
  - User Story 1 (P1): Critical path - must complete first
  - User Story 2 (P2): Independent - can run in parallel with US1 verification tasks
  - User Story 3 (P3): Depends on US1 completion (needs working Claude Code for documentation accuracy)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies - can start after Setup
- **User Story 2 (P2)**: Independent of US1 - can verify infrastructure in parallel
- **User Story 3 (P3)**: Soft dependency on US1 - needs Claude Code working to document accurately

### Within Each User Story

**User Story 1 (Critical Path)**:
- T004-T005: Parallelizable (different files)
- T006: Depends on T005 (file must be renamed first)
- T007-T013: Sequential (modifying related imports and logic)
- T014-T016: Sequential verification (build → inspect → test)
- T017-T020: Parallelizable with T014-T016 (different files)

**User Story 2 (Verification)**:
- T021-T022: Parallelizable (reading different parts of Dockerfile)
- T023-T027: Sequential (depends on Docker image from US1)
- T028: Final documentation

**User Story 3 (Documentation)**:
- T029-T036: Can be done in parallel (different README.md sections)
- T037-T038: Can be done in parallel (different files)

### Parallel Opportunities

- **Setup Phase**: T002 and T003 can run in parallel
- **User Story 1**: T004 and T005 can run in parallel; T017-T020 can run in parallel with T014-T016
- **User Story 2**: T021-T022 can run in parallel; T023-T027 can run sequentially but quickly
- **User Story 3**: T029-T036 can all run in parallel (different README sections); T037-T038 in parallel
- **Polish Phase**: T039-T042 can all run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch Dockerfile and file rename together:
Task: "Update agent-image/Dockerfile to replace opencode with @anthropic-ai/claude-code"
Task: "Rename agent-image/scripts/src/opencode.js to claude.js"

# Later, launch CI config updates in parallel with Docker verification:
Task: "Update gitlab-utils/.gitlab-ci.yml variable names"
Task: "Verify Claude Code CLI installed in Docker image"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Skip Phase 2: Foundational (not applicable)
3. Complete Phase 3: User Story 1 (T004-T020)
4. **STOP and VALIDATE**: Test Claude Code execution via @ai trigger
5. Deploy/test if ready - this is a working MVP

### Incremental Delivery

1. Complete User Story 1 → Test independently → **MVP Ready** (Claude Code works)
2. Add User Story 2 → Verify infrastructure → **Infrastructure Validated**
3. Add User Story 3 → Update documentation → **Production Ready**
4. Run Polish phase → Final validation → **Release**

### Parallel Team Strategy

With multiple developers:

1. Developer A: User Story 1 (critical path - T004-T020)
2. Developer B: User Story 2 (verification - T021-T028, starts after US1 Docker build)
3. Developer C: User Story 3 (documentation - T029-T038, starts after US1 completion)
4. All developers: Polish phase together (T039-T046)

**Timeline Estimate**: ~2-3 hours total (following quickstart.md estimates)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- User Story 1 is the critical path - must complete first for MVP
- User Story 2 is verification-focused - minimal code changes
- User Story 3 is documentation-only - can be done last
- No formal test suite - validation via manual pipeline triggers
- Commit frequently (after each logical group of tasks)
- Use quickstart.md as reference for implementation details
- Keep rollback plan ready (documented in quickstart.md)
