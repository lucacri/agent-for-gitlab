# GitLab CI/CD Configuration Examples

This directory contains example GitLab CI/CD configurations for the AI agent webhook handler.

## Which Configuration Should I Use?

### 📦 `.gitlab-ci.yml` - Docker Executor (Standard)

**Use this if:**
- ✅ You're using GitLab.com or GitLab shared runners
- ✅ You want the simplest setup
- ✅ You're okay with environment variables for authentication
- ✅ You don't need custom volume mounts

**Authentication methods:**
1. `CLAUDE_CODE_OAUTH_TOKEN` (recommended)
2. `CLAUDE_CREDENTIALS` (file variable)
3. `ANTHROPIC_API_KEY`

**Setup:** Copy to your project root and set CI/CD variables.

---

### 🐚 `.gitlab-ci.shell-executor.yml` - Shell Executor + Docker Run

**Use this if:**
- ✅ You have a self-hosted GitLab runner
- ✅ You want to manage Claude credentials as files on the runner host
- ✅ You need custom volume mounts (SSL certs, configs, etc.)
- ✅ You want full control over the Docker container execution

**Authentication method:**
- Mounted profile directory: `~/agent-for-gitlab/.claude/`

**Setup:**
1. Create profile directory on runner host
2. Copy to your project root as `.gitlab-ci.yml`
3. Follow setup instructions in the file

---

## Quick Comparison

| Feature | Docker Executor | Shell Executor |
|---------|----------------|----------------|
| **Runner type** | Any (shared/dedicated) | Self-hosted only |
| **Setup complexity** | Simple (just CI/CD vars) | Moderate (host setup required) |
| **Authentication** | Environment variables | Mounted files or env vars |
| **Credential management** | GitLab UI | Files on runner host |
| **Volume control** | Limited | Full control |
| **SSL certificates** | Auto-handled | Manual mount |
| **Best for** | Cloud/shared runners | Self-hosted runners |

---

## Authentication Quick Reference

### Method 1: `CLAUDE_CODE_OAUTH_TOKEN` (Easiest)
```bash
# In GitLab Settings → CI/CD → Variables
CLAUDE_CODE_OAUTH_TOKEN = sk-ant-oat01-xxxxx
```

**Works with:** Both configurations
**Setup time:** 2 minutes
**Best for:** Most users

---

### Method 2: Mounted Profile (Most Flexible)
```bash
# On GitLab runner host
mkdir -p ~/agent-for-gitlab/.claude
docker run -it --rm \
  -v ~/agent-for-gitlab/.claude:/root/.claude:rw \
  lucacri/agent-for-gitlab:latest \
  sh -c "claude login"
```

**Works with:** Shell executor only
**Setup time:** 5 minutes
**Best for:** Self-hosted runners, profile management

---

### Method 3: `CLAUDE_CREDENTIALS` (File Variable)
```bash
# In GitLab Settings → CI/CD → Variables
CLAUDE_CREDENTIALS = <contents of ~/.claude/.credentials.json>
Type: File
```

**Works with:** Docker executor
**Setup time:** 3 minutes
**Best for:** Teams with existing credential files

---

## Example Usage

### Standard Setup (Docker Executor)

```bash
# 1. Copy the configuration
cp gitlab-utils/.gitlab-ci.yml .

# 2. Set CI/CD variable in GitLab
#    Settings → CI/CD → Variables → Add variable
#    Name: CLAUDE_CODE_OAUTH_TOKEN
#    Value: sk-ant-oat01-xxxxx
#    Type: Variable
#    Flags: ✅ Masked

# 3. Commit and push
git add .gitlab-ci.yml
git commit -m "Add AI agent configuration"
git push
```

### Shell Executor Setup

```bash
# 1. On GitLab runner host, create profile
ssh runner-host
mkdir -p ~/agent-for-gitlab/.claude
docker run -it --rm \
  -v ~/agent-for-gitlab/.claude:/root/.claude:rw \
  lucacri/agent-for-gitlab:latest \
  sh -c "claude login"
chmod 700 ~/agent-for-gitlab/.claude
chmod 600 ~/agent-for-gitlab/.claude/.credentials.json

# 2. Copy the configuration (on your local machine)
cp gitlab-utils/.gitlab-ci.shell-executor.yml .gitlab-ci.yml

# 3. Commit and push
git add .gitlab-ci.yml
git commit -m "Add AI agent configuration (shell executor)"
git push
```

---

## Required CI/CD Variables

### Both Configurations Require:

| Variable | Description | How to get |
|----------|-------------|------------|
| `GITLAB_TOKEN` | GitLab Personal Access Token | Settings → Access Tokens → Create (scopes: `api`, `read_repository`, `write_repository`) |

### Docker Executor Also Requires ONE of:

| Variable | Type | Description |
|----------|------|-------------|
| `CLAUDE_CODE_OAUTH_TOKEN` | Variable | OAuth token from Claude (recommended) |
| `CLAUDE_CREDENTIALS` | File | Contents of `~/.claude/.credentials.json` |
| `ANTHROPIC_API_KEY` | Variable | Anthropic API key |

### Shell Executor:

- **No Claude auth variables needed** if using mounted profile
- Or use `CLAUDE_CODE_OAUTH_TOKEN` for environment-based auth

---

## Troubleshooting

### "GITLAB_TOKEN not set"
**Solution:** Add `GITLAB_TOKEN` to Settings → CI/CD → Variables

### "Claude authentication failed"
**Solution:** Verify your chosen auth method is set up correctly:
- Docker: Check CI/CD variables
- Shell: Check `~/agent-for-gitlab/.claude/.credentials.json` exists on runner host

### "SSL certificate problem"
**Shell executor:** Ensure `/etc/ssl/certs` is mounted (already in example)
**Docker executor:** Should be handled automatically

### "Permission denied" (shell executor)
**Solution:** Check file permissions on runner host
```bash
chmod 700 ~/agent-for-gitlab/.claude
chmod 600 ~/agent-for-gitlab/.claude/.credentials.json
```

---

## More Information

- **Agent Image:** https://hub.docker.com/r/lucacri/agent-for-gitlab
- **Main Documentation:** See root `README.md`
- **Authentication Details:** See `agent-image/README.md`
- **Webhook Setup:** See `gitlab-app/README.md`

---

## Questions?

- **Which should I use?** → Start with Docker executor (`.gitlab-ci.yml`) unless you need advanced features
- **Can I switch later?** → Yes! Both configurations are compatible
- **Do I need both files?** → No, choose one based on your runner type
- **Can I use both?** → Yes, but you only need one in your project root

---

**Last updated:** 2025-10-24
**Version:** Compatible with agent-for-gitlab:latest
