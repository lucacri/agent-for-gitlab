---
description: "Task list for Optional Claude Configuration Mounting"
---

# Tasks: Optional Claude Configuration Mounting

**Input**: Design documents from `/specs/002-mount-claude-config/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not explicitly requested in feature specification - implementation tasks only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- This feature modifies the agent-image Docker container
- Primary files: agent-image/entrypoint.sh (new), agent-image/Dockerfile (modify), documentation files

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project structure and prepare for implementation

- [X] T001 Verify agent-image/ directory structure exists
- [X] T002 Review existing agent-image/Dockerfile to understand current entrypoint/CMD configuration
- [X] T003 [P] Review agent-image/scripts/src/claude.js to understand current authentication methods

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Document current authentication priority order in plan.md (verify with codebase)
- [X] T005 Identify mount point paths to use (/claude-config for config dir, /root/.claude for credentials)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Set-and-Forget Configuration (Priority: P1) 🎯 MVP

**Goal**: Enable users to mount Claude configuration directories and have the container automatically use them on every startup

**Independent Test**: Mount host directories with .claude.json and .claude/ folder, start container, verify Claude CLI authenticates successfully using mounted configuration

### Implementation for User Story 1

- [X] T006 [P] [US1] Create entrypoint script shell file at agent-image/entrypoint.sh with shebang and basic structure
- [X] T007 [US1] Implement file existence check in agent-image/entrypoint.sh (check if /claude-config/.claude.json exists)
- [X] T008 [US1] Implement configuration file copy logic in agent-image/entrypoint.sh (cp /claude-config/.claude.json to /root/.claude.json)
- [X] T009 [US1] Add command execution preservation in agent-image/entrypoint.sh (exec "$@" to run original command)
- [X] T010 [US1] Make entrypoint script executable and add to agent-image/Dockerfile (COPY entrypoint.sh, RUN chmod +x)
- [X] T011 [US1] Set ENTRYPOINT directive in agent-image/Dockerfile to use entrypoint.sh
- [X] T012 [US1] Preserve existing CMD in agent-image/Dockerfile (keep CMD ["sh"])
- [X] T013 [US1] Manually test: Build Docker image and run with both mounts (-v for /claude-config and /root/.claude)
- [X] T014 [US1] Manually test: Verify .claude.json is copied to /root/.claude.json at container startup
- [X] T015 [US1] Manually test: Verify Claude CLI can authenticate using mounted configuration

**Checkpoint**: At this point, User Story 1 should be fully functional - users can mount config and container uses it

---

## Phase 4: User Story 2 - Configuration Validation with Strict Error Handling (Priority: P2)

**Goal**: Ensure container fails immediately with clear error messages when mounted configuration is invalid or unreadable

**Independent Test**: Mount config directory with unreadable .claude.json file, verify container fails to start with appropriate error message

### Implementation for User Story 2

- [X] T016 [US2] Add set -e directive to agent-image/entrypoint.sh for strict error handling (exit on any command failure)
- [X] T017 [US2] Add error message output in agent-image/entrypoint.sh before copy operation (echo "Copying Claude configuration...")
- [X] T018 [US2] Add success message output in agent-image/entrypoint.sh after copy operation (echo "Configuration copied successfully")
- [X] T019 [US2] Add explicit error handling for copy failure in agent-image/entrypoint.sh (|| { echo "ERROR: Failed to copy..." >&2; exit 1; })
- [X] T020 [US2] Manually test: Create unreadable .claude.json file (chmod 000) and verify container fails to start
- [X] T021 [US2] Manually test: Verify error message clearly explains the copy operation failed
- [X] T022 [US2] Manually test: Mount /claude-config without .claude.json file and verify container starts normally (optional mount behavior)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - mounting works correctly, and invalid configs fail fast with clear errors

---

## Phase 5: User Story 3 - Backward Compatible Authentication (Priority: P3)

**Goal**: Ensure existing container deployments continue to work without modification after upgrading to new image version

**Independent Test**: Run container without any mounts and verify it authenticates using ANTHROPIC_API_KEY environment variable or existing /root/.claude/.credentials.json file

### Implementation for User Story 3

- [X] T023 [US3] Verify entrypoint script proceeds normally when /claude-config not mounted (no file existence check failure)
- [X] T024 [US3] Manually test: Run container with no mounts and ANTHROPIC_API_KEY environment variable, verify authentication works
- [X] T025 [US3] Manually test: Run container with existing /root/.claude/.credentials.json (from previous run or baked in), verify authentication works
- [X] T026 [US3] Manually test: Run container with only /root/.claude mount (no /claude-config), verify authentication works
- [X] T027 [US3] Manually test: Verify authentication priority order - mounted config takes precedence over env var
- [X] T028 [US3] Review and confirm existing docker run commands from docs still work unchanged
- [X] T029 [US3] Review and confirm existing docker-compose.yml examples still work unchanged

**Checkpoint**: All user stories should now be independently functional - new mounting feature works, errors are handled, and backward compatibility is preserved

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, examples, and security guidance that affect all user stories

### Documentation Updates

- [X] T030 [P] Add "Docker Configuration - Claude Settings" section to root README.md with basic mount examples
- [X] T031 [P] Add "Mounting Claude Configuration" section to agent-image/README.md with detailed examples
- [X] T032 [P] Document authentication priority order in agent-image/README.md (mounted config > credentials > env var)
- [X] T033 [P] Add docker-compose.yml example with volume mounts to agent-image/README.md
- [X] T034 [P] Add GitLab CI/CD integration notes to agent-image/README.md (recommend env vars for CI)

### Security Documentation

- [X] T035 [P] Add security best practices section to agent-image/README.md (read-only mounts, file permissions)
- [X] T036 [P] Document recommended file permissions on host (600 for .claude.json, 700 for .claude/ directory)
- [X] T037 [P] Add warning about not logging credential contents in entrypoint script comments

### Troubleshooting and Examples

- [X] T038 [P] Add troubleshooting section to agent-image/README.md (permission errors, file not found, authentication fails)
- [X] T039 [P] Add multiple usage pattern examples to agent-image/README.md (same location, separate locations, compose)
- [X] T040 [P] Link to quickstart.md from agent-image/README.md for quick reference

### Validation

- [X] T041 Run through quickstart.md validation scenarios to verify all examples work
- [X] T042 Review all documentation for accuracy and completeness
- [X] T043 Verify backward compatibility claims with manual testing of old docker run commands

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 but adds error handling independently
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Validates existing behavior, independent of US1/US2 implementation

**Note**: While US2 modifies the entrypoint created in US1, it primarily adds error handling. US3 is entirely independent validation work. For sequential implementation, follow P1 → P2 → P3 order.

### Within Each User Story

- US1: Script creation → Dockerfile modification → Testing
- US2: Error handling → Testing → Validation
- US3: Testing only (verify backward compatibility)
- Polish: All documentation tasks can run in parallel

### Parallel Opportunities

- Phase 1: Tasks T002 and T003 can run in parallel (different files)
- Phase 3 (US1): Tasks T006 can start while reviewing existing files
- Phase 6 (Polish): All documentation tasks (T030-T040) can run in parallel - different files

---

## Parallel Example: User Story 1

```bash
# After T005 completes, launch US1 tasks in sequence:
# T006: Create entrypoint.sh shell file
# T007-T009: Implement logic in entrypoint.sh (sequential - same file)
# T010-T012: Modify Dockerfile (sequential - depends on entrypoint.sh)
# T013-T015: Manual testing (sequential - validation)
```

---

## Parallel Example: Polish Phase

```bash
# All documentation tasks can run in parallel:
Task: "Add Docker Configuration section to README.md"
Task: "Add Mounting Claude Configuration section to agent-image/README.md"
Task: "Add security best practices section to agent-image/README.md"
Task: "Add troubleshooting section to agent-image/README.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (understand existing structure)
2. Complete Phase 2: Foundational (document authentication methods)
3. Complete Phase 3: User Story 1 (core mounting functionality)
4. **STOP and VALIDATE**: Test User Story 1 independently with manual docker run commands
5. Deploy/demo if ready - users can now mount their Claude config!

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP! - mounting works)
3. Add User Story 2 → Test independently → Deploy/Demo (error handling added)
4. Add User Story 3 → Test independently → Deploy/Demo (backward compatibility verified)
5. Add Polish → Final documentation and examples complete
6. Each story adds value without breaking previous stories

### Sequential Implementation Strategy (Recommended)

Since this is a small feature modifying a single container image:

1. **Week 1**: Setup + Foundational + US1 (core functionality)
   - Create entrypoint script
   - Modify Dockerfile
   - Test mounting works
   - **Checkpoint**: Mounting feature works!

2. **Week 2**: US2 (error handling) + US3 (compatibility validation)
   - Add strict error handling to entrypoint
   - Test error cases thoroughly
   - Validate all existing authentication methods
   - **Checkpoint**: Feature complete and robust!

3. **Week 3**: Polish (documentation)
   - Update all documentation
   - Add examples and troubleshooting
   - Create comprehensive guides
   - **Checkpoint**: Feature fully documented!

---

## Notes

- [P] tasks = different files, no dependencies between them
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No automated tests requested - rely on manual testing per task
- Commit after each task or logical group (e.g., after completing entrypoint.sh, after modifying Dockerfile)
- Stop at any checkpoint to validate story independently before moving to next
- Focus on backward compatibility - existing deployments MUST continue to work (SC-003, SC-006)
- Security: Never log credential contents, document best practices for file permissions

## Task Count Summary

- **Total Tasks**: 43
- **Phase 1 (Setup)**: 3 tasks
- **Phase 2 (Foundational)**: 2 tasks
- **Phase 3 (US1 - P1)**: 10 tasks (core functionality)
- **Phase 4 (US2 - P2)**: 7 tasks (error handling)
- **Phase 5 (US3 - P3)**: 7 tasks (backward compatibility)
- **Phase 6 (Polish)**: 14 tasks (documentation and validation)

**Parallel Opportunities**: 11 tasks marked [P] can potentially run in parallel with other work

**MVP Scope**: Phases 1-3 (15 tasks) deliver core mounting functionality - recommended first increment
