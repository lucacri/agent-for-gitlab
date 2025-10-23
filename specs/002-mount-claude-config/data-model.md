# Data Model: Optional Claude Configuration Mounting

**Feature**: 002-mount-claude-config
**Date**: 2025-10-22
**Purpose**: Define configuration file structures and container mount points

## Overview

This feature does not involve traditional database entities. Instead, it defines configuration file structures and Docker mount point contracts that govern how Claude configuration is passed from host to container.

## Configuration Entities

### 1. Claude Configuration File (.claude.json)

**Purpose**: Contains Claude CLI settings, preferences, and session configuration

**Location in Container**: `/root/.claude.json`

**Source**: Copied from `/claude-config/.claude.json` at container startup (if mounted)

**File Format**: JSON

**Structure** (Example):
```json
{
  "defaultModel": "claude-sonnet-4",
  "systemInstructions": "You are a helpful assistant...",
  "maxTokens": 4096,
  "temperature": 0.7,
  "settings": {
    "autoSave": true,
    "theme": "dark"
  }
}
```

**Attributes**:
- `defaultModel` (string, optional): Default Claude model to use
- `systemInstructions` (string, optional): Custom system prompt
- `maxTokens` (integer, optional): Maximum tokens per request
- `temperature` (float, optional): Sampling temperature (0.0-1.0)
- `settings` (object, optional): User preferences

**Validation Rules**:
- File must be valid JSON (parsing errors cause container startup failure per FR-005)
- File must be readable by container (permissions enforced by FR-005)
- Size typically < 10KB (no enforcement, but performance consideration)

**Lifecycle**:
- **Creation**: User creates on host system
- **Mount**: User mounts parent directory to `/claude-config` in container
- **Copy**: Entrypoint script copies to `/root/.claude.json` at startup (FR-004)
- **Update**: Changes on host require container restart to take effect (copy happens once per startup)

### 2. Claude Credentials Directory (.claude/)

**Purpose**: Contains authentication credentials and additional Claude-related files

**Location in Container**: `/root/.claude/`

**Source**: Directly mounted from host (no copying)

**Structure**:
```
/root/.claude/
├── .credentials.json   # Authentication credentials (primary file)
├── config.json         # Additional configuration (optional)
├── history/            # Session history (optional)
└── cache/              # Cached data (optional)
```

**Primary File: .credentials.json**

**File Format**: JSON

**Structure** (Example):
```json
{
  "apiKey": "sk-ant-...",
  "sessionToken": "...",
  "refreshToken": "..."
}
```

**Attributes**:
- `apiKey` (string, required): Anthropic API key
- `sessionToken` (string, optional): Session authentication token
- `refreshToken` (string, optional): Token refresh credentials

**Validation Rules**:
- Must contain valid API key or session credentials
- Invalid credentials cause authentication failure at CLI invocation (not at startup)
- File permissions should be 600 or 400 on host (security best practice, not enforced)

**Lifecycle**:
- **Creation**: User creates on host system (manual or via Claude CLI login)
- **Mount**: User mounts directory to `/root/.claude/` in container
- **Access**: Claude CLI reads directly from mounted directory (no copy)
- **Update**: Changes on host immediately available in container (SC-005)

### 3. Configuration Mount Point (/claude-config)

**Purpose**: Container directory where user mounts host configuration directory

**Type**: Docker volume mount (external to container)

**Mounting**: User-defined (typically `-v ~/my-config:/claude-config:ro`)

**Contents** (Expected):
```
/claude-config/
└── .claude.json        # Only file currently used (FR-003)
```

**Mount Characteristics**:
- **Optional**: Container starts normally if not mounted (FR-006)
- **Read-only recommended**: Use `:ro` flag for security (not enforced, but documented)
- **Validation**: If `.claude.json` exists in this directory, it MUST be readable (FR-005)

**Lifecycle**:
- **Pre-startup**: User creates mount binding in docker run or docker-compose
- **Startup**: Entrypoint script checks for `/claude-config/.claude.json`
- **Runtime**: No further interaction with this mount point after startup copy

### 4. Credentials Mount Point (/root/.claude)

**Purpose**: Container directory where user mounts host .claude/ credentials folder

**Type**: Docker volume mount (external to container)

**Mounting**: User-defined (typically `-v ~/.claude:/root/.claude:ro`)

**Mount Characteristics**:
- **Optional**: Container starts normally if not mounted (FR-006)
- **Read-only recommended**: Use `:ro` flag for security
- **Direct access**: Claude CLI reads from this directory without intermediate copying

**Lifecycle**:
- **Pre-startup**: User creates mount binding in docker run or docker-compose
- **Startup**: No special processing by entrypoint (just a mount)
- **Runtime**: Claude CLI accesses credentials on-demand during execution

## Authentication Priority Order

The system resolves authentication in this order (FR-007):

1. **Mounted .claude.json**: If `/claude-config/.claude.json` exists → copied to `/root/.claude.json`
2. **Mounted credentials**: If `/root/.claude/.credentials.json` exists (via mount) → used by Claude CLI
3. **Existing credentials**: If `/root/.claude/.credentials.json` exists from previous runs → used by Claude CLI
4. **Environment variable**: If `ANTHROPIC_API_KEY` set → used by Claude CLI
5. **Failure**: No valid authentication found → Claude CLI fails with error

**Note**: The entrypoint only handles step 1 (copying .claude.json). Steps 2-5 are handled by Claude CLI at runtime.

## Container State Model

### States

1. **No Configuration** (Backward Compatible)
   - No mounts, uses `ANTHROPIC_API_KEY` env var
   - Container starts normally (FR-006)
   - Authentication: environment variable

2. **Mounted Credentials Only**
   - `/root/.claude` mounted
   - No `/claude-config` mount
   - Container starts normally (FR-006)
   - Authentication: mounted credentials file

3. **Mounted Config Only**
   - `/claude-config` mounted with `.claude.json`
   - No `/root/.claude` mount
   - Container starts, copies `.claude.json`
   - Authentication: depends on other methods (env var, existing creds)

4. **Full Configuration** (Recommended)
   - Both `/claude-config` and `/root/.claude` mounted
   - Container starts, copies `.claude.json`
   - Authentication: mounted credentials

5. **Invalid Configuration** (Error State)
   - `/claude-config/.claude.json` exists but unreadable
   - Container startup FAILS immediately (FR-005)
   - Error message: clear description of problem (FR-008)

### State Transitions

```
Container Start
    ↓
Check /claude-config/.claude.json exists?
    ↓
Yes → Attempt copy → Success? → Continue to CMD
                   ↓ Failure?
                   ↓
                   Exit with error (FR-005)
    ↓
No → Continue to CMD (FR-006)
    ↓
Execute original command (exec "$@")
```

## File Ownership and Permissions

### Host Side

**Recommended**:
- `.claude.json`: 600 (rw------) or 400 (r--------)
- `.claude/` directory: 700 (rwx------)
- `.claude/.credentials.json`: 600 (rw------) or 400 (r--------)

**Rationale**: Prevents unauthorized access to credentials on multi-user systems

### Container Side

**After Mount**:
- Files retain host UID/GID (Docker volume mount behavior)
- Container runs as root (agent-image default), can read any mounted files
- Copied `/root/.claude.json` owned by root:root with 644 permissions

**Security Note**: Container runs as root, so host file permissions are advisory (defense-in-depth on host side)

## Volume Mount Specifications

### Type: Bind Mount

Both mount points use Docker bind mounts (not named volumes)

**Syntax**:
```bash
-v <host-path>:<container-path>[:<options>]
```

**Options**:
- `ro`: Read-only mount (recommended for security)
- `rw`: Read-write mount (default, allows container to modify host files)

**Examples**:
```bash
# Read-only mounts (recommended)
-v ~/.claude:/root/.claude:ro
-v ~/config:/claude-config:ro

# Read-write mounts (if container needs to update config)
-v ~/.claude:/root/.claude
-v ~/config:/claude-config
```

## Compatibility Matrix

| Mount Configuration | Container Starts? | Authentication Method | Notes |
|---------------------|-------------------|----------------------|-------|
| No mounts | ✅ Yes | ANTHROPIC_API_KEY | Backward compatible (SC-003) |
| /root/.claude only | ✅ Yes | Mounted .credentials.json | Partial config |
| /claude-config only | ✅ Yes | ANTHROPIC_API_KEY or existing | Config copied, needs auth elsewhere |
| Both mounts | ✅ Yes | Mounted .credentials.json | Full configuration (recommended) |
| /claude-config with unreadable file | ❌ No (fail fast) | N/A | Strict error handling (FR-005) |

## Edge Cases

1. **Empty /claude-config directory**: Container starts normally (no .claude.json to copy)
2. **Corrupted .claude.json (invalid JSON)**: Copy succeeds, Claude CLI may fail later
3. **/root/.claude already exists in image**: Mounting overwrites it completely
4. **/root/.claude.json already exists**: Overwritten by entrypoint copy (FR-004)
5. **Both .claude.json sources exist**: Mounted version takes precedence via copy

## Summary

This data model defines:
- Two configuration file types (.claude.json and .claude/ directory)
- Two container mount points (/claude-config and /root/.claude)
- Authentication priority order (mounted config > existing creds > env var)
- Container state model (5 states, clear transitions)
- File permissions and ownership guidelines
- Compatibility matrix for different mount configurations

No traditional database entities or API contracts are needed for this infrastructure feature.
