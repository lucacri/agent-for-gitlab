#!/bin/sh
# Entrypoint script for agent-image container
# Handles optional Claude configuration mounting with strict error handling
#
# Features:
# - Copies /claude-config/.claude.json to /root/.claude.json at startup (if present)
# - Fails fast with clear error messages on invalid configuration
# - Maintains full backward compatibility with existing authentication methods
#
# Authentication priority (handled by Claude CLI):
# 1. /root/.claude.json (copied from /claude-config if mounted)
# 2. /root/.claude/.credentials.json (mounted or pre-existing)
# 3. ANTHROPIC_API_KEY environment variable
#
# Security: Never logs credential contents

set -e  # Exit immediately on any command failure

# Check if configuration file is mounted and copy if present
if [ -f "/claude-config/.claude.json" ]; then
    echo "Copying Claude configuration..."
    cp /claude-config/.claude.json /root/.claude.json || {
        echo "ERROR: Failed to copy /claude-config/.claude.json" >&2
        echo "Please verify the file exists and is readable" >&2
        exit 1
    }
    echo "Configuration copied successfully"
fi

# Execute the original command (preserves all arguments)
exec "$@"
