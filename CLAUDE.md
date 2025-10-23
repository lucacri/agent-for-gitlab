# agent-for-gitlab Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-19

## Active Technologies
- Node.js 24.x (ESM modules) + @anthropic-ai/claude-code (CLI), @modelcontextprotocol/sdk, zod, tsx (001-revert-claude-code)
- Shell script (sh/bash) for entrypoint, Dockerfile syntax for container configuration + Docker base image (php:8.4-cli), existing Claude Code CLI installation, shell utilities (cp, test, exec) (002-mount-claude-config)
- N/A - configuration files only (no persistent database) (002-mount-claude-config)

## Project Structure
```
backend/
frontend/
tests/
```

## Commands
# Add commands for Node.js 24.x (ESM modules)

## Code Style
Node.js 24.x (ESM modules): Follow standard conventions

## Recent Changes
- 002-mount-claude-config: Added Shell script (sh/bash) for entrypoint, Dockerfile syntax for container configuration + Docker base image (php:8.4-cli), existing Claude Code CLI installation, shell utilities (cp, test, exec)
- 001-revert-claude-code: Added Node.js 24.x (ESM modules) + @anthropic-ai/claude-code (CLI), @modelcontextprotocol/sdk, zod, tsx

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
