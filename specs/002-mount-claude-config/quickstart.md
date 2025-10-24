# Quick Start: Optional Claude Configuration Mounting

**Feature**: 002-mount-claude-config
**Date**: 2025-10-22
**Purpose**: Get started with mounting Claude configuration into agent-image container

## Overview

This feature allows you to mount your existing Claude configuration and credentials into the agent-image container, eliminating the need to manually manage credentials for each container run. Configuration changes on your host are immediately available in the container without rebuilding.

## Prerequisites

- Docker installed
- Claude configuration files on your host:
  - `~/.claude/` directory with credentials
  - A directory containing `.claude.json` (can be same as `~/.claude/` or separate)
- agent-for-gitlab image (version with this feature)

## 5-Minute Setup

### Step 1: Prepare Host Configuration

Create a configuration directory (if you don't already have one):

```bash
# Option A: Use existing ~/.claude directory for both
ls ~/.claude/.credentials.json  # Verify credentials exist
ls ~/.claude.json               # Verify config exists (optional)

# Option B: Create separate config directory
mkdir -p ~/my-claude-config
cp ~/.claude.json ~/my-claude-config/  # Or create a new one
```

### Step 2: Run Container with Mounts

**Basic Example** (recommended):
```bash
docker run -it --rm \
  -v ~/.claude:/root/.claude:ro \
  -v ~/.claude.json:/claude-config/.claude.json:ro \
  -v $(pwd):/opt/agent/repo \
  lucacri/agent-for-gitlab \
  ai-runner --model sonnet "Analyze this codebase"
```

**What This Does**:
- Mounts your `.claude/` credentials folder → container can authenticate
- Mounts your `.claude.json` config file → copied to `/root/.claude.json` at startup
- Mounts current directory → agent can access your code
- Runs `ai-runner` with sonnet model

### Step 3: Verify It Works

If successful, you'll see:
```
Copying Claude configuration...
Configuration copied successfully
[Claude CLI output continues...]
```

If configuration is invalid:
```
ERROR: Failed to copy /claude-config/.claude.json
```

## Common Usage Patterns

### Pattern 1: Config file in home directory

```bash
# .claude.json is at ~/.claude.json
docker run -it --rm \
  -v ~/.claude:/root/.claude:ro \
  -v ~/.claude.json:/claude-config/.claude.json:ro \
  lucacri/agent-for-gitlab \
  ai-runner
```

### Pattern 2: Config in separate directory

```bash
# .claude.json is in a separate directory like ~/my-config/.claude.json
docker run -it --rm \
  -v ~/.claude:/root/.claude:ro \
  -v ~/my-config/.claude.json:/claude-config/.claude.json:ro \
  lucacri/agent-for-gitlab \
  ai-runner
```

**Alternative:** If the directory contains .claude.json, mount the whole directory:
```bash
docker run -it --rm \
  -v ~/.claude:/root/.claude:ro \
  -v ~/my-config:/claude-config:ro \
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

### Pattern 4: GitLab CI/CD (Recommended: Use Env Vars)

For CI/CD pipelines, **environment variables are recommended** over mounts:

```yaml
# .gitlab-ci.yml
ai-analysis:
  image: lucacri/agent-for-gitlab:latest
  script:
    - ai-runner --model sonnet "Run tests"
  variables:
    ANTHROPIC_API_KEY: $CLAUDE_API_KEY  # From GitLab CI/CD variables
```

**Why?** CI runners may not have access to host filesystems, and managing secrets via GitLab's masked variables is more secure.

## Backward Compatibility

**Existing setups continue to work without changes!**

### Method 1: Environment Variable (Still Works)

```bash
docker run -it --rm \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  lucacri/agent-for-gitlab \
  ai-runner
```

### Method 2: Pre-existing Credentials (Still Works)

```bash
# If credentials exist in the image or from previous runs
docker run -it --rm \
  lucacri/agent-for-gitlab \
  ai-runner
```

### Authentication Priority

The container tries methods in this order:
1. Mounted `/claude-config/.claude.json` (copied to `/root/.claude.json`)
2. Mounted `/root/.claude/.credentials.json`
3. Existing `/root/.claude/.credentials.json` (from previous runs)
4. `ANTHROPIC_API_KEY` environment variable
5. Error if none found

## Troubleshooting

### "ERROR: Failed to copy /claude-config/.claude.json"

**Cause**: File exists but is unreadable

**Solution**:
```bash
# Check file exists
ls -la ~/my-claude-config/.claude.json

# Fix permissions
chmod 600 ~/my-claude-config/.claude.json

# Verify you can read it
cat ~/my-claude-config/.claude.json
```

### Container Starts But Authentication Fails

**Cause**: Config copied successfully, but no valid credentials

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

### "Configuration Not Updated"

**Cause**: Container caches config at startup

**Solution**: Restart container to copy new `.claude.json`:
```bash
docker restart <container-id>
# Or for docker-compose:
docker-compose restart
```

### Permission Denied on Host Files

**Cause**: Host files not readable by Docker

**Solution**:
```bash
# Make config readable
chmod 644 ~/my-claude-config/.claude.json

# Make credentials directory accessible
chmod 755 ~/.claude
chmod 600 ~/.claude/.credentials.json
```

### Changes Not Visible in Container

**For `.claude.json`**: Restart container (file copied once at startup)

**For `.claude/` files**: Changes are immediate (direct mount) - no restart needed

## Security Best Practices

### 1. Use Read-Only Mounts

Always use `:ro` flag to prevent container from modifying host files:
```bash
-v ~/.claude:/root/.claude:ro
-v ~/config:/claude-config:ro
```

### 2. Set Proper File Permissions

```bash
# Config file
chmod 600 ~/.claude.json

# Credentials directory and files
chmod 700 ~/.claude
chmod 600 ~/.claude/.credentials.json
```

### 3. GitLab CI/CD Security

- Store API keys in **GitLab CI/CD variables** (Settings > CI/CD > Variables)
- Mark variables as **Masked** and **Protected**
- Use environment variables instead of mounting files in CI:
  ```yaml
  variables:
    ANTHROPIC_API_KEY: $CLAUDE_API_KEY
  ```

### 4. Avoid Committing Credentials

Add to `.gitignore`:
```gitignore
.claude/
.claude.json
**/credentials.json
```

## Next Steps

- **Full Documentation**: See `agent-image/README.md` for detailed configuration options
- **Architecture**: See main `README.md` for how this fits into the GitLab workflow
- **Advanced Usage**: See `data-model.md` for configuration file structures
- **Implementation Details**: See `research.md` for design decisions

## Common Questions

**Q: Do I need both mounts?**
A: No. You can mount just `/root/.claude` for credentials, or use environment variables. The `/claude-config` mount is optional.

**Q: Can I mount different locations?**
A: Yes! Any host directory can be mounted to `/claude-config` as long as it contains `.claude.json`.

**Q: What happens if I don't mount anything?**
A: Container works as before - uses `ANTHROPIC_API_KEY` environment variable or existing credentials.

**Q: Can I use this in production?**
A: Yes, but for CI/CD environments, environment variables are recommended over file mounts for easier secrets management.

**Q: How do I update my config?**
A: Edit files on host, then restart container. Changes to mounted `.claude/` files are immediate.

## Example: Full Workflow

```bash
# 1. Verify your Claude config exists
ls -la ~/.claude/.credentials.json
cat ~/.claude.json

# 2. Create a working directory
mkdir ~/my-project && cd ~/my-project

# 3. Run agent with mounted config
docker run -it --rm \
  -v ~/.claude:/root/.claude:ro \
  -v ~/.claude.json:/claude-config/.claude.json:ro \
  -v $(pwd):/opt/agent/repo \
  lucacri/agent-for-gitlab \
  ai-runner --model sonnet "Create a Python script to analyze CSV files"

# 4. Verify output
ls -la  # Agent-generated files appear here

# 5. Run again with different task (no re-auth needed!)
docker run -it --rm \
  -v ~/.claude:/root/.claude:ro \
  -v ~/.claude.json:/claude-config/.claude.json:ro \
  -v $(pwd):/opt/agent/repo \
  lucacri/agent-for-gitlab \
  ai-runner --model sonnet "Add error handling to the script"
```

---

**Ready to implement?** See `tasks.md` (generated by `/speckit.tasks`) for step-by-step implementation instructions.
