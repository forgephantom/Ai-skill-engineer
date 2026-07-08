-- Database Schema: {{PROJECT_NAME}}
-- Version: {{VERSION}}
-- Generated: {{DATE}}
-- Dialect: {{DIALECT}} (PostgreSQL 16+ / MySQL 8.0+ / SQLite 3.40+)

-- =============================================================================
-- EXTENSIONS & CONFIGURATION
-- =============================================================================

-- PostgreSQL extensions
{{#if POSTGRES}}
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
{{/if}}

-- Settings
{{#if POSTGRES}}
SET timezone = 'UTC';
SET statement_timeout = '30s';
SET lock_timeout = '10s';
SET idle_in_transaction_session_timeout = '60s';
{{/if}}

-- =============================================================================
-- ENUMS & TYPES
-- =============================================================================

{{#each ENUMS}}
CREATE TYPE {{NAME}} AS ENUM ({{#each VALUES}}'{{this}}'{{#unless @last}}, {{/unless}}{{/each}});
{{/each}}

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Users & Authentication
{{#if HAS_USERS}}
CREATE TABLE users (
    id {{UUID_TYPE}} PRIMARY KEY DEFAULT {{UUID_DEFAULT}},
    email CITEXT NOT NULL UNIQUE,
    email_verified_at TIMESTAMPTZ,
    password_hash TEXT, -- NULL for OAuth-only users
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    locale VARCHAR(10) DEFAULT 'en-US',
    timezone VARCHAR(50) DEFAULT 'UTC',
    status {{USER_STATUS_ENUM}} NOT NULL DEFAULT 'active',
    last_login_at TIMESTAMPTZ,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMPTZ,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret TEXT,
    backup_codes TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_created_at ON users(created_at DESC);
{{/if}}

-- Sessions
{{#if HAS_SESSIONS}}
CREATE TABLE sessions (
    id {{UUID_TYPE}} PRIMARY KEY DEFAULT {{UUID_DEFAULT}},
    user_id {{UUID_TYPE}} NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE, -- SHA-256 of session token
    user_agent TEXT,
    ip_address INET,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at) WHERE revoked_at IS NULL;
{{/if}}

-- API Keys
{{#if HAS_API_KEYS}}
CREATE TABLE api_keys (
    id {{UUID_TYPE}} PRIMARY KEY DEFAULT {{UUID_DEFAULT}},
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL UNIQUE, -- SHA-256 of API key
    key_prefix VARCHAR(20) NOT NULL, -- First 8 chars for identification
    user_id {{UUID_TYPE}} NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scopes TEXT[] NOT NULL DEFAULT '{}',
    rate_limit INT DEFAULT 1000, -- requests per hour
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_key_prefix ON api_keys(key_prefix);
{{/if}}

-- Roles & Permissions (RBAC)
{{#if HAS_RBAC}}
CREATE TABLE roles (
    id {{UUID_TYPE}} PRIMARY KEY DEFAULT {{UUID_DEFAULT}},
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE permissions (
    id {{UUID_TYPE}} PRIMARY KEY DEFAULT {{UUID_DEFAULT}},
    name VARCHAR(100) NOT NULL UNIQUE, -- e.g., "users:read", "billing:write"
    description TEXT,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE role_permissions (
    role_id {{UUID_TYPE}} NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id {{UUID_TYPE}} NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
    user_id {{UUID_TYPE}} NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id {{UUID_TYPE}} NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    granted_by {{UUID_TYPE}} REFERENCES users(id),
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_expires_at ON user_roles(expires_at) WHERE expires_at IS NOT NULL;
{{/if}}

-- Organizations / Tenants (Multi-tenancy)
{{#if HAS_TENANTS}}
CREATE TABLE organizations (
    id {{UUID_TYPE}} PRIMARY KEY DEFAULT {{UUID_DEFAULT}},
    name TEXT NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    logo_url TEXT,
    domain CITEXT UNIQUE, -- For custom domains
    status {{ORG_STATUS_ENUM}} NOT NULL DEFAULT 'active',
    plan {{PLAN_ENUM}} NOT NULL DEFAULT 'free',
    trial_ends_at TIMESTAMPTZ,
    billing_email CITEXT,
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_domain ON organizations(domain) WHERE domain IS NOT NULL;
CREATE INDEX idx_organizations_status ON organizations(status) WHERE deleted_at IS NULL;

CREATE TABLE organization_members (
    organization_id {{UUID_TYPE}} NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id {{UUID_TYPE}} NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id {{UUID_TYPE}} NOT NULL REFERENCES roles(id),
    invited_by {{UUID_TYPE}} REFERENCES users(id),
    invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    joined_at TIMESTAMPTZ,
    PRIMARY KEY (organization_id, user_id)
);

CREATE INDEX idx_org_members_user_id ON organization_members(user_id);
{{/if}}

-- =============================================================================
-- FEATURE TABLES (Add per project requirements)
-- =============================================================================

{{#each FEATURE_TABLES}}
-- {{NAME}}
CREATE TABLE {{TABLE_NAME}} (
    id {{UUID_TYPE}} PRIMARY KEY DEFAULT {{UUID_DEFAULT}},
    {{#each COLUMNS}}
    {{NAME}} {{TYPE}} {{#if NOT_NULL}}NOT NULL{{/if}} {{#if DEFAULT}}DEFAULT {{DEFAULT}}{{/if}} {{#if UNIQUE}}UNIQUE{{/if}},
    {{/each}}
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
    {{#if TENANT_ID}},
    tenant_id {{UUID_TYPE}} NOT NULL REFERENCES organizations(id) ON DELETE CASCADE
    {{/if}}
);

{{#each INDEXES}}
CREATE INDEX {{NAME}} ON {{TABLE_NAME}} ({{COLUMNS}}) {{#if WHERE}}WHERE {{WHERE}}{{/if}};
{{/each}}

{{#each FOREIGN_KEYS}}
ALTER TABLE {{TABLE_NAME}} ADD CONSTRAINT {{CONSTRAINT_NAME}}
    FOREIGN KEY ({{COLUMN}}) REFERENCES {{REF_TABLE}}({{REF_COLUMN}}) {{ON_DELETE}};
{{/each}}
{{/each}}

-- =============================================================================
-- AUDIT & EVENT LOGGING
-- =============================================================================

{{#if HAS_AUDIT}}
CREATE TABLE audit_logs (
    id {{UUID_TYPE}} PRIMARY KEY DEFAULT {{UUID_DEFAULT}},
    event_type VARCHAR(100) NOT NULL, -- e.g., "user.created", "payment.processed"
    event_category VARCHAR(50) NOT NULL, -- "auth", "data", "security", "billing"
    severity VARCHAR(20) NOT NULL DEFAULT 'info', -- "debug", "info", "warn", "error", "critical"

    -- Actor
    actor_type VARCHAR(50), -- "user", "system", "api_key", "webhook"
    actor_id {{UUID_TYPE}},
    actor_ip INET,
    actor_user_agent TEXT,

    -- Target
    target_type VARCHAR(50), -- "user", "organization", "resource"
    target_id {{UUID_TYPE}},

    -- Context
    organization_id {{UUID_TYPE}} REFERENCES organizations(id),
    resource_type VARCHAR(50),
    resource_id {{UUID_TYPE}},

    -- Payload
    changes JSONB, -- { before: {}, after: {} }
    metadata JSONB NOT NULL DEFAULT '{}',

    -- Timing
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_occurred_at ON audit_logs(occurred_at DESC);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_type, actor_id);
CREATE INDEX idx_audit_logs_target ON audit_logs(target_type, target_id);
CREATE INDEX idx_audit_logs_org ON audit_logs(organization_id, occurred_at DESC);
CREATE INDEX idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- Partitioning for large audit tables (PostgreSQL)
{{#if POSTGRES}}
-- CREATE TABLE audit_logs_y2025m01 PARTITION OF audit_logs
--     FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
{{/if}}
{{/if}}

-- =============================================================================
-- OUTBOX PATTERN (Event-Driven Architecture)
-- =============================================================================

{{#if HAS_OUTBOX}}
CREATE TABLE outbox_events (
    id {{UUID_TYPE}} PRIMARY KEY DEFAULT {{UUID_DEFAULT}},
    aggregate_type VARCHAR(100) NOT NULL,
    aggregate_id {{UUID_TYPE}} NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    attempts INT DEFAULT 0,
    last_error TEXT
);

CREATE INDEX idx_outbox_unpublished ON outbox_events(published_at) WHERE published_at IS NULL;
CREATE INDEX idx_outbox_aggregate ON outbox_events(aggregate_type, aggregate_id);
{{/if}}

-- =============================================================================
-- FEATURE FLAGS
-- =============================================================================

{{#if HAS_FEATURE_FLAGS}}
CREATE TABLE feature_flags (
    id {{UUID_TYPE}} PRIMARY KEY DEFAULT {{UUID_DEFAULT}},
    key VARCHAR(100) NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    enabled BOOLEAN NOT NULL DEFAULT FALSE,
    rollout_percentage INT DEFAULT 0, -- 0-100
    targeting_rules JSONB DEFAULT '[]', -- [{"attribute": "plan", "operator": "in", "values": ["pro"]}]
    environments TEXT[] DEFAULT '{development,staging,production}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_feature_flags_enabled ON feature_flags(enabled) WHERE enabled = TRUE;
{{/if}}

-- =============================================================================
-- WEBHOOKS
-- =============================================================================

{{#if HAS_WEBHOOKS}}
CREATE TABLE webhook_endpoints (
    id {{UUID_TYPE}} PRIMARY KEY DEFAULT {{UUID_DEFAULT}},
    organization_id {{UUID_TYPE}} NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    secret TEXT NOT NULL, -- For signature verification
    events TEXT[] NOT NULL, -- Subscribed event types
    status {{WEBHOOK_STATUS_ENUM}} NOT NULL DEFAULT 'active',
    failure_count INT DEFAULT 0,
    last_success_at TIMESTAMPTZ,
    last_failure_at TIMESTAMPTZ,
    last_failure_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE webhook_deliveries (
    id {{UUID_TYPE}} PRIMARY KEY DEFAULT {{UUID_DEFAULT}},
    endpoint_id {{UUID_TYPE}} NOT NULL REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    response_status INT,
    response_body TEXT,
    response_headers JSONB,
    attempt INT NOT NULL DEFAULT 1,
    succeeded BOOLEAN NOT NULL DEFAULT FALSE,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_webhook_deliveries_endpoint ON webhook_deliveries(endpoint_id, created_at DESC);
CREATE INDEX idx_webhook_deliveries_pending ON webhook_deliveries(succeeded, attempt) WHERE succeeded = FALSE AND attempt < 5;
{{/if}}

-- =============================================================================
-- TRIGGERS & FUNCTIONS
-- =============================================================================

-- Updated_at trigger
{{#if POSTGRES}}
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

{{#each TABLES_WITH_UPDATED_AT}}
DROP TRIGGER IF EXISTS update_{{NAME}}_updated_at ON {{NAME}};
CREATE TRIGGER update_{{NAME}}_updated_at
    BEFORE UPDATE ON {{NAME}}
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
{{/each}}
{{/if}}

-- Soft delete enforcement (PostgreSQL RLS)
{{#if POSTGRES}}
{{#each SOFT_DELETE_TABLES}}
ALTER TABLE {{NAME}} ENABLE ROW LEVEL SECURITY;

CREATE POLICY {{NAME}}_select_policy ON {{NAME}}
    FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY {{NAME}}_insert_policy ON {{NAME}}
    FOR INSERT WITH CHECK (deleted_at IS NULL);

CREATE POLICY {{NAME}}_update_policy ON {{NAME}}
    FOR UPDATE USING (deleted_at IS NULL) WITH CHECK (deleted_at IS NULL);

CREATE POLICY {{NAME}}_delete_policy ON {{NAME}}
    FOR DELETE USING (deleted_at IS NULL);
{{/each}}
{{/if}}

-- =============================================================================
-- SEED DATA
-- =============================================================================

{{#if HAS_RBAC}}
-- Default roles
INSERT INTO roles (name, description, is_system) VALUES
    ('owner', 'Full access to organization', TRUE),
    ('admin', 'Administrative access', TRUE),
    ('member', 'Standard member access', TRUE),
    ('viewer', 'Read-only access', TRUE)
ON CONFLICT (name) DO NOTHING;

-- Default permissions
INSERT INTO permissions (name, description, resource, action) VALUES
    ('users:read', 'View users', 'users', 'read'),
    ('users:write', 'Manage users', 'users', 'write'),
    ('users:delete', 'Delete users', 'users', 'delete'),
    ('organization:read', 'View organization', 'organization', 'read'),
    ('organization:write', 'Manage organization', 'organization', 'write'),
    ('billing:read', 'View billing', 'billing', 'read'),
    ('billing:write', 'Manage billing', 'billing', 'write'),
    ('api_keys:read', 'View API keys', 'api_keys', 'read'),
    ('api_keys:write', 'Manage API keys', 'api_keys', 'write')
ON CONFLICT (name) DO NOTHING;

-- Role permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE (r.name, p.name) IN (
    ('owner', 'users:read'), ('owner', 'users:write'), ('owner', 'users:delete'),
    ('owner', 'organization:read'), ('owner', 'organization:write'),
    ('owner', 'billing:read'), ('owner', 'billing:write'),
    ('owner', 'api_keys:read'), ('owner', 'api_keys:write'),
    ('admin', 'users:read'), ('admin', 'users:write'),
    ('admin', 'organization:read'), ('admin', 'organization:write'),
    ('admin', 'billing:read'), ('admin', 'api_keys:read'), ('admin', 'api_keys:write'),
    ('member', 'users:read'), ('member', 'organization:read'),
    ('member', 'billing:read'), ('member', 'api_keys:read'),
    ('viewer', 'users:read'), ('viewer', 'organization:read'), ('viewer', 'billing:read')
ON CONFLICT DO NOTHING;
{{/if}}

{{#if HAS_FEATURE_FLAGS}}
-- Default feature flags
INSERT INTO feature_flags (key, name, description, enabled, rollout_percentage) VALUES
    ('new_dashboard', 'New Dashboard', 'Redesigned dashboard UI', FALSE, 0),
    ('beta_features', 'Beta Features', 'Access to beta features', FALSE, 10),
    ('advanced_analytics', 'Advanced Analytics', 'Enhanced analytics dashboard', FALSE, 0)
ON CONFLICT (key) DO NOTHING;
{{/if}}

-- =============================================================================
-- VIEWS FOR COMMON QUERIES
-- =============================================================================

{{#if HAS_USERS}}
CREATE VIEW active_users AS
SELECT id, email, full_name, avatar_url, locale, timezone, last_login_at, created_at
FROM users
WHERE status = 'active' AND deleted_at IS NULL;
{{/if}}

{{#if HAS_TENANTS}}
CREATE VIEW organization_member_details AS
SELECT
    om.organization_id,
    om.user_id,
    u.email,
    u.full_name,
    u.avatar_url,
    r.name AS role_name,
    om.joined_at
FROM organization_members om
JOIN users u ON u.id = om.user_id
JOIN roles r ON r.id = om.role_id
WHERE u.deleted_at IS NULL AND om.joined_at IS NOT NULL;
{{/if}}

-- =============================================================================
-- MIGRATION METADATA
-- =============================================================================

{{#if POSTGRES}}
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    checksum VARCHAR(64) NOT NULL
);

INSERT INTO schema_migrations (version, name, checksum) VALUES
    ('{{VERSION}}', 'initial_schema', '{{CHECKSUM}}')
ON CONFLICT (version) DO NOTHING;
{{/if}}

-- =============================================================================
-- PERFORMANCE NOTES
-- =============================================================================

/*
INDEXING STRATEGY:
- Primary keys: UUID with UUIDv7 (time-ordered) for better insert performance
- Foreign keys: Always indexed
- Query patterns: Composite indexes matching WHERE + ORDER BY clauses
- Soft deletes: Partial indexes excluding deleted_at
- JSONB: GIN indexes for containment queries

PARTITIONING (for large tables):
- audit_logs: Monthly by occurred_at
- webhook_deliveries: Monthly by created_at
- outbox_events: Monthly by created_at

CONNECTION POOLING:
- PgBouncer in transaction mode
- Max connections: 100 per pod
- Pool size: 20-50 per application instance

READ REPLICAS:
- Route analytical queries to read replicas
- Use synchronous_commit = off for async replicas
*/