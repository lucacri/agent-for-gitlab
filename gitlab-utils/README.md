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
- ✅ You have a private GitLab instance with custom SSL certificates
- ✅ You need to mount /etc/ssl/certs for SSL verification
- ✅ You want full control over the Docker container execution

**Authentication method:**
- `CLAUDE_CODE_OAUTH_TOKEN` environment variable (same as Docker executor)

**Setup:**
1. Ensure gitlab-runner user can run Docker
2. Copy to your project root as `.gitlab-ci.yml`
3. Set `CLAUDE_CODE_OAUTH_TOKEN` in CI/CD variables

---

## Quick Comparison

| Feature | Docker Executor | Shell Executor |
|---------|----------------|----------------|
| **Runner type** | Any (shared/dedicated) | Self-hosted only |
| **Setup complexity** | Simple (just CI/CD vars) | Simple (CI/CD vars + Docker permission) |
| **Authentication** | Environment variables | Environment variables |
| **Credential management** | GitLab UI | GitLab UI |
| **Volume control** | Limited | Full control (docker run) |
| **SSL certificates** | Auto-handled | Manual mount (included in example) |
| **Best for** | Cloud/shared runners | Private GitLab instances with custom SSL |

---

## Authentication Quick Reference

### Method 1: `CLAUDE_CODE_OAUTH_TOKEN` (Recommended)
```bash
# In GitLab Settings → CI/CD → Variables
CLAUDE_CODE_OAUTH_TOKEN = sk-ant-oat01-xxxxx
```

**Works with:** Both configurations
**Setup time:** 2 minutes
**Best for:** Most users (simplest method)

---

### Method 2: `CLAUDE_CREDENTIALS` (File Variable)
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
# 1. Ensure gitlab-runner user can run Docker (on runner host)
ssh runner-host
sudo usermod -aG docker gitlab-runner
sudo gitlab-runner restart

# 2. Copy the configuration (on your local machine)
cp gitlab-utils/.gitlab-ci.shell-executor.yml .gitlab-ci.yml

# 3. Set CI/CD variables in GitLab
#    Settings → CI/CD → Variables → Add variable
#    Name: CLAUDE_CODE_OAUTH_TOKEN
#    Value: sk-ant-oat01-xxxxx
#    Type: Variable
#    Flags: ✅ Masked

# 4. Commit and push
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

### Both Also Require ONE of:

| Variable | Type | Description |
|----------|------|-------------|
| `CLAUDE_CODE_OAUTH_TOKEN` | Variable | OAuth token from Claude (recommended) |
| `CLAUDE_CREDENTIALS` | File | Contents of `~/.claude/.credentials.json` (Docker executor only) |
| `ANTHROPIC_API_KEY` | Variable | Anthropic API key |

---

## Troubleshooting

### "GITLAB_TOKEN not set"
**Solution:** Add `GITLAB_TOKEN` to Settings → CI/CD → Variables

### "Claude authentication failed"
**Solution:** Check CI/CD variables are set correctly:
- Verify `CLAUDE_CODE_OAUTH_TOKEN` or other auth variable exists
- Ensure it's marked as "Masked"
- Get a new token from https://claude.ai/settings/tokens

### "SSL certificate problem"
**Shell executor:** Ensure `/etc/ssl/certs` is mounted (already in example)
**Docker executor:** Should be handled automatically

### "docker: command not found" (shell executor)
**Solution:** gitlab-runner user needs Docker access
```bash
sudo usermod -aG docker gitlab-runner
sudo gitlab-runner restart
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
