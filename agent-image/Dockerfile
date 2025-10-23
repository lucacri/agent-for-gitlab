# Base image: PHP 8.4 CLI with necessary extensions
FROM php:8.4-cli

LABEL org.opencontainers.image.source="https://github.com/lucacri/agent-for-gitlab" \
	  org.opencontainers.image.title="AI GitLab Agent" \
	  org.opencontainers.image.description="Reusable base image for AI GitLab pipeline runner with Claude Code CLI" \
	  org.opencontainers.image.licenses="MIT"

# Install system dependencies
RUN apt-get update && apt-get install -y \
	git \
	curl \
	jq \
	unzip \
	&& rm -rf /var/lib/apt/lists/*

# Install Xdebug (disabled by default, enable via ENV XDEBUG_MODE)
RUN pecl install xdebug \
	&& docker-php-ext-enable xdebug \
	&& echo "xdebug.mode=off" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

# Install Node.js 24.x and npm
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
	&& apt-get install -y nodejs \
	&& rm -rf /var/lib/apt/lists/*

# Install uv (Python package manager)
RUN curl -LsSf https://astral.sh/uv/install.sh | sh \
	&& mv /root/.local/bin/uv /usr/local/bin/uv \
	&& mv /root/.local/bin/uvx /usr/local/bin/uvx

# Install Claude Code CLI
RUN npm install -g @anthropic-ai/claude-code

# Copy runner sources
WORKDIR /opt/agent
COPY scripts/ /opt/agent/
RUN cd /opt/agent && npm install --production

# Node ESM support and convenience launcher
RUN printf "#!/usr/bin/env sh\nnode /opt/agent/ai-runner.js \"$@\"\n" > /usr/local/bin/ai-runner \
	&& chmod +x /usr/local/bin/ai-runner

# Copy and configure entrypoint script for optional config mounting
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Set entrypoint to handle configuration mounting
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Default shell; CI jobs will invoke `ai-runner`
CMD ["sh"]

