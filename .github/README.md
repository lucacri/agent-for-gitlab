# GitHub Actions Workflows

This directory contains automated CI/CD workflows for the agent-for-gitlab project.

## Workflows

### 1. Docker Build and Push (`docker-build-push.yml`)

Builds and pushes the agent Docker image to Docker Hub (`lucacri/agent-for-gitlab`).

**Triggers:**
- Push to `main` branch → builds `latest` tag
- Push of semantic version tags (`v*.*.*`) → builds versioned tags
- Manual workflow dispatch → builds custom tag

**Image Tags:**
- `latest` - Latest build from main branch
- `v1.2.3` - Semantic version (e.g., v1.2.3)
- `v1.2` - Major.minor version
- `v1` - Major version
- `sha-abc1234` - Git commit SHA (short)

**Multi-platform support:**
- `linux/amd64` (x86_64)
- `linux/arm64` (ARM, Apple Silicon)

### 2. Semantic Release (`semantic-release.yml`)

Automatically creates version tags based on conventional commits.

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**Commit Types:**
- `feat: ...` → Minor version bump (0.x.0)
- `fix: ...` → Patch version bump (0.0.x)
- `BREAKING CHANGE:` → Major version bump (x.0.0)
- `docs:`, `refactor:`, `perf:` → Patch version bump
- `chore:`, `test:`, `ci:`, `build:` → No release

**Example commits:**
```bash
# Patch release (0.0.1)
git commit -m "fix: resolve authentication timeout issue"

# Minor release (0.1.0)
git commit -m "feat: add support for Claude Opus model"

# Major release (1.0.0)
git commit -m "feat: new authentication system

BREAKING CHANGE: Removed support for API key authentication"
```

## Setup Instructions

### Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

1. **`DOCKER_USERNAME`** - Your Docker Hub username (`lucacri`)
2. **`DOCKER_PASSWORD`** - Your Docker Hub access token or password

**How to create Docker Hub access token:**
1. Go to https://hub.docker.com/settings/security
2. Click "New Access Token"
3. Name: `github-actions-agent-for-gitlab`
4. Permissions: Read & Write
5. Copy the token and add it as `DOCKER_PASSWORD` secret

### Workflow Permissions

The workflows use the following permissions:
- `contents: write` - For creating tags and updating CHANGELOG.md (semantic-release)
- `packages: write` - For pushing Docker images
- `issues: write`, `pull-requests: write` - For release notes (semantic-release)

These are automatically granted via `GITHUB_TOKEN`.

## Usage

### Automated Release (Recommended)

1. Commit with conventional commit format:
   ```bash
   git commit -m "feat: add new MCP server integration"
   git push origin main
   ```

2. Semantic Release workflow runs:
   - Analyzes commits since last release
   - Determines next version (patch/minor/major)
   - Creates git tag (e.g., `v1.2.3`)
   - Updates CHANGELOG.md
   - Creates GitHub release

3. Docker Build workflow automatically triggers:
   - Builds agent image from `agent-image/Dockerfile`
   - Pushes to `lucacri/agent-for-gitlab:v1.2.3`
   - Also tags as `lucacri/agent-for-gitlab:v1.2`, `v1`, `latest`

### Manual Release

**Option 1: Create tag manually**
```bash
git tag v1.0.0
git push origin v1.0.0
```
Docker Build workflow triggers automatically.

**Option 2: Manual workflow dispatch**
1. Go to **Actions → Build and Push Docker Image**
2. Click "Run workflow"
3. Enter custom tag (optional): `beta`, `test`, etc.
4. Click "Run workflow"

## Monitoring

**View workflow runs:**
- Go to **Actions** tab in GitHub
- Select workflow: "Build and Push Docker Image" or "Semantic Release"
- View logs, artifacts, and results

**Verify Docker images:**
- Visit https://hub.docker.com/r/lucacri/agent-for-gitlab/tags
- Confirm new tags appear after workflow completes

## Troubleshooting

**Docker push fails:**
- Verify `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets are set
- Ensure Docker Hub access token has Read & Write permissions
- Check repository `lucacri/agent-for-gitlab` exists on Docker Hub

**Semantic release doesn't create tag:**
- Ensure commits follow conventional commit format
- Check if commits are release-worthy (`feat`, `fix`, etc.)
- Verify previous releases exist (first release needs manual tag)

**Multi-platform build fails:**
- This is usually due to platform-specific dependencies
- Check Dockerfile for platform compatibility
- May need to add platform-specific build args

## First Release

For the very first release, you need to manually create an initial tag:

```bash
git tag v0.1.0 -m "Initial release"
git push origin v0.1.0
```

After this, semantic-release will handle all future versions automatically.
