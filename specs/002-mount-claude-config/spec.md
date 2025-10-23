# Feature Specification: Optional Claude Configuration Mounting

**Feature Branch**: `002-mount-claude-config`
**Created**: 2025-10-22
**Status**: Draft
**Input**: User description: "Enable optional Claude configuration mounting in agent-image container: users can mount ~/.claude folder directly and a config directory containing .claude.json that gets copied at startup via entrypoint script, with strict error handling and full backward compatibility"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Set-and-Forget Configuration (Priority: P1)

A developer wants to use their personal Claude configuration in the containerized AI agent without manually managing credentials for each container run. They mount their existing Claude configuration directory once and the container automatically uses it on every startup.

**Why this priority**: This is the core feature that delivers the primary user value - simplified configuration management and consistent Claude behavior across container restarts.

**Independent Test**: Can be fully tested by mounting a host directory with .claude.json and .claude/ folder, starting the container, and verifying Claude CLI authenticates successfully using the mounted configuration.

**Acceptance Scenarios**:

1. **Given** a host directory containing .claude.json and .claude/ folder, **When** the user mounts the config directory to /claude-config and the .claude folder to /root/.claude, **Then** the container starts successfully and .claude.json is copied to /root/.claude.json
2. **Given** a running container with mounted configuration, **When** the container restarts, **Then** .claude.json is copied again (overwriting any previous version) and Claude CLI can authenticate
3. **Given** mounted configuration directories, **When** Claude CLI runs any command, **Then** it successfully authenticates using the mounted credentials without requiring environment variables

---

### User Story 2 - Configuration Validation with Strict Error Handling (Priority: P2)

A user mounts a configuration directory but the .claude.json file has incorrect permissions or is corrupted. The container fails to start with a clear error message, preventing silent failures or confusing authentication errors later.

**Why this priority**: Strict validation ensures users get immediate feedback about configuration problems rather than discovering issues later during AI agent execution. This reduces debugging time and improves user experience.

**Independent Test**: Can be tested by mounting a config directory with unreadable .claude.json file and verifying the container fails to start with an appropriate error message.

**Acceptance Scenarios**:

1. **Given** a mounted /claude-config directory with an unreadable .claude.json file, **When** the container starts, **Then** it fails immediately with a clear error message indicating the file cannot be read
2. **Given** a mounted /claude-config directory without a .claude.json file, **When** the container starts, **Then** it proceeds normally (optional mounting) and uses fallback authentication methods
3. **Given** a mounted .claude.json that cannot be copied due to permissions, **When** the container starts, **Then** it fails with a clear error message explaining the copy operation failed

---

### User Story 3 - Backward Compatible Authentication (Priority: P3)

An existing user has containers configured with environment variables or pre-existing credentials. When they upgrade to the new image version, their containers continue to work without any changes to their setup.

**Why this priority**: Ensures zero breaking changes for existing users and allows gradual migration to the new mounting approach. Users can continue using existing methods while new users benefit from the improved configuration mounting.

**Independent Test**: Can be tested by running the container without any mounts and verifying it authenticates using ANTHROPIC_API_KEY environment variable or existing /root/.claude/.credentials.json file.

**Acceptance Scenarios**:

1. **Given** no mounted configuration directories, **When** the container starts with ANTHROPIC_API_KEY environment variable, **Then** Claude CLI authenticates successfully using the environment variable
2. **Given** no mounted /root/.claude directory, **When** the container starts with an existing /root/.claude/.credentials.json file (from previous runs or baked into image), **Then** Claude CLI authenticates successfully using the existing credentials
3. **Given** both mounted configuration and ANTHROPIC_API_KEY environment variable, **When** the container starts, **Then** the mounted configuration takes precedence (authentication priority order is maintained)

---

### Edge Cases

- What happens when /root/.claude is mounted but /claude-config is not (or vice versa)? System should work with either mount alone and use available authentication methods.
- How does the system handle a corrupted .claude.json file that is readable but contains invalid JSON? Container should fail at startup with a clear error message.
- What happens when the user mounts /claude-config as read-only? Entrypoint can read and copy the file (source is read-only, destination /root/.claude.json is writable).
- How does the system behave when /root/.claude.json already exists before the copy? It is overwritten on every container start (as specified in requirements).
- What happens when .claude/ folder is mounted but contains no credentials? Container starts successfully but Claude CLI will fail with authentication error when executed (standard behavior).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support mounting a host directory to /claude-config containing a .claude.json configuration file
- **FR-002**: System MUST support mounting a host .claude/ directory to /root/.claude for direct access to Claude credentials and configuration files
- **FR-003**: System MUST execute an entrypoint script at container startup that copies /claude-config/.claude.json to /root/.claude.json if the source file exists
- **FR-004**: System MUST copy .claude.json on every container start, overwriting any existing /root/.claude.json file
- **FR-005**: System MUST fail container startup if /claude-config/.claude.json exists but cannot be read or copied (strict error handling)
- **FR-006**: System MUST proceed with normal startup if /claude-config directory is not mounted (optional mounting)
- **FR-007**: System MUST preserve all existing authentication methods and their priority order: mounted config (highest), existing credentials file, environment variable (lowest)
- **FR-008**: System MUST output clear error messages when configuration mounting fails, including the specific failure reason
- **FR-009**: System MUST preserve all command-line arguments passed to the container after configuration mounting completes
- **FR-010**: System MUST maintain compatibility with existing docker run commands, docker-compose configurations, and CI/CD pipelines

### Key Entities

- **Claude Configuration File (.claude.json)**: Contains Claude CLI settings, preferences, and session configuration. Copied from /claude-config to /root/.claude.json at startup.
- **Claude Credentials Directory (.claude/)**: Contains authentication credentials (.credentials.json) and other Claude-related files. Mounted directly to /root/.claude without copying.
- **Configuration Mount Point (/claude-config)**: Container directory where users mount their host configuration directory containing .claude.json.
- **Entrypoint Script**: Shell script executed at container startup responsible for detecting mounted configuration and copying .claude.json to the appropriate location.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can mount their Claude configuration once and it persists across all container restarts without manual intervention
- **SC-002**: Container startup fails within 5 seconds with a clear error message when mounted configuration is invalid or unreadable
- **SC-003**: 100% of existing container deployments (using environment variables or pre-existing credentials) continue to function without modification after upgrading to the new image
- **SC-004**: Users can switch between authentication methods (mounted config, environment variable, existing credentials) without modifying the container image
- **SC-005**: Configuration changes made on the host (editing .claude.json or files in .claude/) are immediately available in the container without rebuilding or recreating it
- **SC-006**: Zero breaking changes for existing docker run commands, docker-compose files, or GitLab CI/CD pipeline configurations
