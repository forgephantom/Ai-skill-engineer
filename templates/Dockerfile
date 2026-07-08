# Dockerfile for {{PROJECT_NAME}}
# Multi-stage build for minimal production image
# Base: {{BASE_IMAGE}} (distroless/alpine/scratch)

# =============================================================================
# STAGE 1: Base / Dependencies
# =============================================================================
FROM {{BASE_IMAGE}} AS base

# Install system dependencies
{{#if HAS_SYSTEM_DEPS}}
RUN {{PKG_MANAGER}} update && {{PKG_MANAGER}} add --no-cache \
    {{#each SYSTEM_DEPS}}
    {{this}} \
    {{/each}}
    && rm -rf /var/cache/{{PKG_MANAGER}}/*
{{/if}}

# Create non-root user
RUN groupadd -r {{APP_USER}} && useradd -r -g {{APP_USER}} -s /sbin/nologin -d /app {{APP_USER}}

# Set working directory
WORKDIR /app

# =============================================================================
# STAGE 2: Builder (Compile / Build)
# =============================================================================
FROM {{BUILDER_IMAGE}} AS builder

# Install build dependencies
{{#if HAS_BUILD_DEPS}}
RUN {{PKG_MANAGER}} update && {{PKG_MANAGER}} add --no-cache \
    {{#each BUILD_DEPS}}
    {{this}} \
    {{/each}}
{{/if}}

WORKDIR /app

# Copy dependency manifests first (for caching)
{{#each DEP_FILES}}
COPY {{this}} ./
{{/each}}

# Install dependencies
{{#if HAS_DEP_INSTALL}}
RUN {{DEP_INSTALL_CMD}}
{{/if}}

# Copy source code
COPY . .

# Build application
{{#if HAS_BUILD}}
RUN {{BUILD_CMD}}
{{/if}}

# Run tests in builder (optional, for CI)
{{#if RUN_TESTS_IN_BUILDER}}
RUN {{TEST_CMD}}
{{/if}}

# =============================================================================
# STAGE 3: Runtime (Minimal)
# =============================================================================
FROM {{RUNTIME_IMAGE}} AS runtime

# Install runtime dependencies only
{{#if HAS_RUNTIME_DEPS}}
RUN {{PKG_MANAGER}} update && {{PKG_MANAGER}} add --no-cache \
    {{#each RUNTIME_DEPS}}
    {{this}} \
    {{/each}}
    && rm -rf /var/cache/{{PKG_MANAGER}}/*
{{/if}}

# Copy non-root user from base
COPY --from=base /etc/passwd /etc/passwd
COPY --from=base /etc/group /etc/group

WORKDIR /app

# Copy built artifacts from builder
{{#each ARTIFACTS}}
COPY --from=builder --chown={{APP_USER}}:{{APP_USER}} {{this}} ./
{{/each}}

# Copy configuration templates
{{#each CONFIG_FILES}}
COPY --chown={{APP_USER}}:{{APP_USER}} {{this}} ./
{{/each}}

# Switch to non-root user
USER {{APP_USER}}

# Environment variables
ENV {{APP_ENV_VARS}}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD {{HEALTHCHECK_CMD}} || exit 1

# Expose port
EXPOSE {{PORT}}

# Entrypoint
ENTRYPOINT [{{ENTRYPOINT}}]

# Default command
CMD [{{CMD}}]

# =============================================================================
# STAGE 4: Development (Optional)
# =============================================================================
FROM builder AS development

# Install development tools
{{#if HAS_DEV_TOOLS}}
RUN {{PKG_MANAGER}} add --no-cache \
    {{#each DEV_TOOLS}}
    {{this}} \
    {{/each}}
{{/if}}

# Override for development
ENV NODE_ENV=development
ENV PYTHONPATH=/app
ENV GOFLAGS="-mod=mod"

# Expose debug ports
EXPOSE {{DEBUG_PORT}}

CMD [{{DEV_CMD}}]

# =============================================================================
# LABELS & METADATA
# =============================================================================
LABEL org.opencontainers.image.title="{{PROJECT_NAME}}"
LABEL org.opencontainers.image.description="{{DESCRIPTION}}"
LABEL org.opencontainers.image.version="{{VERSION}}"
LABEL org.opencontainers.image.created="{{BUILD_DATE}}"
LABEL org.opencontainers.image.revision="{{GIT_COMMIT}}"
LABEL org.opencontainers.image.source="{{GIT_REPO}}"
LABEL org.opencontainers.image.licenses="{{LICENSE}}"
LABEL org.opencontainers.image.vendor="{{VENDOR}}"