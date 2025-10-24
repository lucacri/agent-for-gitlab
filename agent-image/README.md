# Agent Image - Claude Configuration Mounting

This document describes how to use the agent-image Docker container with optional Claude configuration mounting.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Configuration Mounting](#configuration-mounting)
- [Authentication Methods](#authentication-methods)
- [Usage Patterns](#usage-patterns)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)
- [GitLab CI/CD Integration](#gitlab-cicd-integration)

## Overview

The agent image (`lucacri/agent-for-gitlab`) is a Docker container that includes:

- PHP 8.4 CLI with Xdebug
- Node.js 24.x
- Python package manager (uv)
- Git, curl, jq, and other utilities
- Claude Code CLI
- Modular AI runner (`ai-runner`)

**Docker-Specific Configuration:**

The container sets `IS_SANDBOX=1` environment variable to allow Claude Code CLI to run with `--dangerously-skip-permissions` flag in Docker's root user context. This is safe because Docker provides container isolation.

The container supports three authentication methods:

1. **Mounted configuration files** (this feature)
2. **Environment variables** (`ANTHROPIC_API_KEY`)
3. **Pre-existing credentials** (baked into image or from previous runs)

## Quick Start

### Using Mounted Configuration

```bash
# Mount credentials directory and config file
docker run -it --rm \
  -v ~/.claude:/root/.claude:ro \
  -v ~/.claude.json:/claude-config/.claude.json:ro \
  -v $(pwd):/opt/agent/repo \
  lucacri/agent-for-gitlab \
  ai-runner --model sonnet "Analyze this codebase"
```

### Using Environment Variable

```bash
# Use API key from environment
docker run -it --rm \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  -v $(pwd):/opt/agent/repo \
  lucacri/agent-for-gitlab \
  ai-runner --model sonnet "Review this code"
```

## Configuration Mounting

### Mount Points

The container supports two mount points for Claude configuration:

| Mount Point | Purpose | Contains | Required |
|-------------|---------|----------|----------|
| `/root/.claude` | Credentials directory | `.credentials.json`, session data | Optional |
| `/claude-config` | Configuration directory | `.claude.json` | Optional |

### How It Works

1. **At Container Startup**: If `/claude-config/.claude.json` exists, it's copied to `/root/.claude.json`
2. **During Execution**: Claude CLI reads authentication from mounted or existing files
3. **On Failure**: Container exits immediately with clear error message if configuration is invalid

### File Structure

**Expected host structure:**

```
~/.claude/
├── .credentials.json    # Authentication credentials
├── config.json          # Additional settings (optional)
└── history/             # Session history (optional)

~/.claude.json           # CLI configuration (optional)
```

**Container structure after mounting:**

```
/root/
├── .claude/             # Mounted or pre-existing
│   └── .credentials.json
└── .claude.json         # Copied from /claude-config if mounted
```

## Authentication Methods

### Priority Order

The container tries authentication methods in this order:

1. **Mounted `.claude.json`** (copied to `/root/.claude.json` at startup)
2. **Mounted `/root/.claude/.credentials.json`** (directly accessed)
3. **Pre-existing `/root/.claude/.credentials.json`** (from previous runs or baked in)
4. **`ANTHROPIC_API_KEY` environment variable**
5. **Error** (no valid authentication found)

### Method Comparison

| Method | Best For | Pros | Cons |
|--------|----------|------|------|
| Mounted Config | Local development | Easy to update, reflects host changes | Requires host files |
| Environment Variable | CI/CD pipelines | Simple, GitLab secrets integration | Must provide on every run |
| Pre-existing Credentials | Persistent containers | No external dependencies | Static, hard to update |

## Usage Patterns

### Pattern 1: Config file in home directory

Mount credentials directory and config file separately:

```bash
docker run -it --rm \
  -v ~/.claude:/root/.claude:ro \
  -v ~/.claude.json:/claude-config/.claude.json:ro \
  -v $(pwd):/opt/agent/repo \
  lucacri/agent-for-gitlab \
  ai-runner
```

### Pattern 2: Config in separate directory

If you keep `.claude.json` in a separate directory:

```bash
docker run -it --rm \
  -v ~/.claude:/root/.claude:ro \
  -v ~/my-config/.claude.json:/claude-config/.claude.json:ro \
  -v $(pwd):/opt/agent/repo \
  lucacri/agent-for-gitlab \
  ai-runner
```

**Alternative:** Mount entire config directory if it contains `.claude.json`:

```bash
docker run -it --rm \
  -v ~/.claude:/root/.claude:ro \
  -v ~/my-config:/claude-config:ro \
  -v $(pwd):/opt/agent/repo \
  lucacri/agent-for-gitlab \
  ai-runner
```

### Pattern 3: Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  agent:
    image: lucacri/agent-for-gitlab:latest
    volumes:
      - ~/.claude:/root/.claude:ro
      - ~/.claude.json:/claude-config/.claude.json:ro
      - ./project:/opt/agent/repo
    command: ai-runner --model sonnet "Review this code"
    stdin_open: true
    tty: true
```

Run with:

```bash
docker-compose up
```

### Pattern 4: Only Credentials (No .claude.json)

Mount only the credentials directory:

```bash
docker run -it --rm \
  -v ~/.claude:/root/.claude:ro \
  -v $(pwd):/opt/agent/repo \
  lucacri/agent-for-gitlab \
  ai-runner
```

## Security Best Practices

### 1. Use Read-Only Mounts

Always use `:ro` flag to prevent container from modifying host files:

```bash
-v ~/.claude:/root/.claude:ro
-v ~/config:/claude-config:ro
```

### 2. Set Proper File Permissions

On the host system:

```bash
# Configuration file
chmod 600 ~/.claude.json

# Credentials directory and files
chmod 700 ~/.claude
chmod 600 ~/.claude/.credentials.json
```

### 3. Never Commit Credentials

Add to `.gitignore`:

```gitignore
.claude/
.claude.json
**/credentials.json
```

### 4. GitLab CI/CD Security

For CI/CD pipelines:

- Store API keys in **GitLab CI/CD variables** (Settings > CI/CD > Variables)
- Mark variables as **Masked** and **Protected**
- Prefer environment variables over file mounts in CI:

```yaml
# .gitlab-ci.yml
ai-analysis:
  image: lucacri/agent-for-gitlab:latest
  script:
    - ai-runner --model sonnet "Run tests"
  variables:
    ANTHROPIC_API_KEY: $CLAUDE_API_KEY  # From GitLab CI/CD variables
```

### 5. Avoid Logging Credentials

The entrypoint script follows these rules:

- Never echoes file contents
- Only logs operation status ("Copying...", "Success", "Error")
- Errors describe the problem without exposing sensitive data

## Troubleshooting

### "ERROR: Failed to copy /claude-config/.claude.json"

**Cause**: File exists but is unreadable

**Solutions**:

```bash
# Check file exists and permissions
ls -la ~/.claude/.claude.json

# Fix permissions
chmod 600 ~/.claude/.claude.json

# Verify you can read it
cat ~/.claude/.claude.json
```

### Container Starts But Authentication Fails

**Cause**: Configuration copied successfully, but no valid credentials

**Solutions**:

1. **Mount credentials directory**:
   ```bash
   -v ~/.claude:/root/.claude:ro
   ```

2. **Or use environment variable**:
   ```bash
   -e ANTHROPIC_API_KEY=sk-ant-...
   ```

3. **Check credentials file**:
   ```bash
   cat ~/.claude/.credentials.json  # Should contain apiKey
   ```

### Configuration Changes Not Visible

**Cause**: Container caches config at startup

**Solution**: Restart container to copy new `.claude.json`:

```bash
docker restart <container-id>

# Or for docker-compose:
docker-compose restart
```

**Note**: Changes to mounted `/root/.claude/` files are immediate (no restart needed).

### Permission Denied on Host Files

**Cause**: Host files not readable by Docker

**Solution**:

```bash
# Make config readable
chmod 644 ~/.claude/.claude.json

# Make credentials directory accessible
chmod 755 ~/.claude
chmod 600 ~/.claude/.credentials.json
```

### Container Fails to Start Immediately

**Cause**: Invalid or corrupted configuration file

**Check the error message**:

```bash
docker logs <container-id>
```

**Solutions**:

1. Validate `.claude.json` is valid JSON:
   ```bash
   cat ~/.claude/.claude.json | jq .
   ```

2. Check file is readable:
   ```bash
   test -r ~/.claude/.claude.json && echo "OK" || echo "FAIL"
   ```

3. Test without mounts to isolate the issue:
   ```bash
   docker run -it --rm \
     -e ANTHROPIC_API_KEY=sk-ant-... \
     lucacri/agent-for-gitlab \
     ai-runner
   ```

## GitLab CI/CD Integration

### Recommended Approach: Environment Variables

For GitLab CI/CD pipelines, **environment variables are recommended** over file mounts:

**Why?**
- CI runners may not have access to host filesystems
- GitLab's masked variables provide better secrets management
- Simpler pipeline configuration
- No file permission issues

**Example `.gitlab-ci.yml`:**

```yaml
ai-analysis:
  image: lucacri/agent-for-gitlab:latest
  script:
    - ai-runner --model sonnet "Analyze code quality"
  variables:
    ANTHROPIC_API_KEY: $CLAUDE_API_KEY  # From GitLab CI/CD variables
    AI_MODEL: "sonnet"
    AI_INSTRUCTIONS: "Focus on security and performance"
```

### Alternative: File-Based Credentials in CI

If you need to use file-based credentials in CI:

```yaml
ai-analysis:
  image: lucacri/agent-for-gitlab:latest
  before_script:
    - mkdir -p /root/.claude
    - echo "$CLAUDE_CREDENTIALS" > /root/.claude/.credentials.json
  script:
    - ai-runner --model sonnet "Run analysis"
  variables:
    CLAUDE_CREDENTIALS: $CLAUDE_CREDENTIALS_BASE64  # Base64-encoded file from GitLab variables
```

### Authentication Priority in CI

When both methods are available:

1. Mounted/created `.credentials.json` (from `CLAUDE_CREDENTIALS` variable)
2. `ANTHROPIC_API_KEY` environment variable
3. Error (no valid authentication found)

## Advanced Usage

### Custom Configuration Per Project

Create project-specific `.claude.json`:

```json
{
  "defaultModel": "claude-sonnet-4",
  "maxTokens": 8192,
  "temperature": 0.7,
  "systemInstructions": "You are a code reviewer focusing on security..."
}
```

Mount it to the container:

```bash
docker run -it --rm \
  -v ~/.claude:/root/.claude:ro \
  -v ./project-config:/claude-config:ro \
  -v $(pwd):/opt/agent/repo \
  lucacri/agent-for-gitlab \
  ai-runner
```

### Multiple Projects with Different Configs

```bash
# Project A (strict security review)
docker run -it --rm \
  -v ~/.claude:/root/.claude:ro \
  -v ./config-security:/claude-config:ro \
  -v ./project-a:/opt/agent/repo \
  lucacri/agent-for-gitlab ai-runner

# Project B (creative code generation)
docker run -it --rm \
  -v ~/.claude:/root/.claude:ro \
  -v ./config-creative:/claude-config:ro \
  -v ./project-b:/opt/agent/repo \
  lucacri/agent-for-gitlab ai-runner
```

### Testing Configuration Mounting

Verify the entrypoint works correctly:

```bash
# Test 1: No mounts (should start normally)
docker run -it --rm \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  lucacri/agent-for-gitlab \
  sh -c "echo 'Container started successfully'"

# Test 2: Mount config (should copy .claude.json)
docker run -it --rm \
  -v ~/.claude:/claude-config:ro \
  lucacri/agent-for-gitlab \
  sh -c "test -f /root/.claude.json && echo 'Config copied' || echo 'No config'"

# Test 3: Invalid config (should fail with error)
docker run -it --rm \
  -v /nonexistent:/claude-config:ro \
  lucacri/agent-for-gitlab \
  sh -c "echo 'Should not reach this'"
```

## Backward Compatibility

**All existing deployment methods continue to work without changes!**

### Existing Method 1: Environment Variable

```bash
# Still works exactly as before
docker run -it --rm \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  lucacri/agent-for-gitlab ai-runner
```

### Existing Method 2: Pre-existing Credentials

```bash
# Still works if credentials exist in the image
docker run -it --rm \
  lucacri/agent-for-gitlab ai-runner
```

### Existing Method 3: GitLab CI/CD Variables

```yaml
# Existing .gitlab-ci.yml files work unchanged
ai-analysis:
  image: lucacri/agent-for-gitlab:latest
  script:
    - ai-runner
  variables:
    ANTHROPIC_API_KEY: $CLAUDE_API_KEY
```

**No breaking changes** - the configuration mounting feature is entirely optional.

## Additional Resources

- **Quick Start Guide**: See [quickstart.md](../specs/002-mount-claude-config/quickstart.md) for step-by-step setup
- **Architecture Details**: See [plan.md](../specs/002-mount-claude-config/plan.md) for implementation design
- **Data Model**: See [data-model.md](../specs/002-mount-claude-config/data-model.md) for file structure details
- **Main README**: See [../README.md](../README.md) for complete system documentation
