# AI Skill Engineer - Makefile
# Common development tasks

.PHONY: help install lint test test-unit test-integration test-e2e test-coverage \
        validate template-test docs clean build docker-build docker-push \
        release-major release-minor release-patch

# Default target
help:
	@echo "AI Skill Engineer - Development Commands"
	@echo ""
	@echo "Setup:"
	@echo "  make install          - Install all dependencies"
	@echo "  make install-tools    - Install development tools"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint             - Run all linters"
	@echo "  make typecheck        - Run type checkers"
	@echo "  make format           - Format code"
	@echo "  make validate         - Run all validation checks"
	@echo ""
	@echo "Testing:"
	@echo "  make test             - Run all tests"
	@echo "  make test-unit        - Run unit tests"
	@echo "  make test-integration - Run integration tests"
	@echo "  make test-e2e         - Run E2E tests"
	@echo "  make test-coverage    - Run tests with coverage report"
	@echo "  make template-test    - Test template rendering"
	@echo ""
	@echo "Documentation:"
	@echo "  make docs             - Build documentation"
	@echo "  make docs-serve       - Serve documentation locally"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build     - Build Docker images"
	@echo "  make docker-test      - Test Docker images"
	@echo ""
	@echo "Release:"
	@echo "  make release-patch    - Bump patch version"
	@echo "  make release-minor    - Bump minor version"
	@echo "  make release-major    - Bump major version"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean            - Clean build artifacts"
	@echo "  make update-deps      - Update dependencies"

# =============================================================================
# SETUP
# =============================================================================

install:
	@echo "Installing dependencies..."
	@if [ -f package.json ]; then npm ci; fi
	@if [ -f go.mod ]; then go mod download; fi
	@if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
	@if [ -f pyproject.toml ]; then pip install -e .; fi

install-tools:
	@echo "Installing development tools..."
	# Node.js tools
	npm install -g @typescript-eslint/eslint-plugin \
	               eslint \
	               prettier \
	               @commitlint/cli \
	               @commitlint/config-conventional
	# Go tools
	go install golang.org/x/tools/cmd/goimports@latest
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
	go install github.com/securego/gosec/v2/cmd/gosec@latest
	# Python tools
	pip install ruff mypy pytest pytest-cov pytest-xdist
	# Docker tools
	curl -sSfL https://raw.githubusercontent.com/hadolint/hadolint/main/install.sh | sh -s -- -b /usr/local/bin
	# Markdown tools
	npm install -g markdownlint-cli

# =============================================================================
# CODE QUALITY
# =============================================================================

lint:
	@echo "Running linters..."
	@if [ -f package.json ]; then npx eslint . --ext .js,.ts,.tsx; fi
	@if [ -f go.mod ]; then golangci-lint run ./...; fi
	@if [ -f pyproject.toml ] || [ -f requirements.txt ]; then ruff check .; fi
	@if [ -f Dockerfile ]; then hadolint Dockerfile; fi
	@markdownlint **/*.md

typecheck:
	@echo "Running type checkers..."
	@if [ -f tsconfig.json ]; then npx tsc --noEmit; fi
	@if [ -f pyproject.toml ]; then mypy .; fi
	@if [ -f go.mod ]; then go vet ./...; fi

format:
	@echo "Formatting code..."
	@if [ -f package.json ]; then npx prettier --write .; fi
	@if [ -f go.mod ]; then goimports -w .; fi
	@if [ -f pyproject.toml ]; then ruff format .; fi

validate: lint typecheck
	@echo "All validation checks passed!"

# =============================================================================
# TESTING
# =============================================================================

test: test-unit test-integration

test-unit:
	@echo "Running unit tests..."
	@if [ -f package.json ]; then npm test -- --passWithNoTests; fi
	@if [ -f go.mod ]; then go test -v -race -coverprofile=coverage.out ./...; fi
	@if [ -f pyproject.toml ]; then pytest tests/unit -v --cov=src --cov-report=term-missing; fi

test-integration:
	@echo "Running integration tests..."
	@if [ -f package.json ]; then npm run test:integration -- --passWithNoTests; fi
	@if [ -f go.mod ]; then go test -v -tags=integration ./...; fi
	@if [ -f pyproject.toml ]; then pytest tests/integration -v; fi

test-e2e:
	@echo "Running E2E tests..."
	@if [ -f package.json ]; then npm run test:e2e -- --passWithNoTests; fi
	@if [ -f pyproject.toml ]; then pytest tests/e2e -v; fi

test-coverage:
	@echo "Running tests with coverage..."
	@if [ -f package.json ]; then npm run test:coverage; fi
	@if [ -f go.mod ]; then go test -coverprofile=coverage.out ./... && go tool cover -html=coverage.out; fi
	@if [ -f pyproject.toml ]; then pytest --cov=src --cov-report=html --cov-report=term; fi

template-test:
	@echo "Testing template rendering..."
	@if [ -f scripts/test-templates.js ]; then node scripts/test-templates.js; fi
	@if [ -f scripts/test-templates.py ]; then python scripts/test-templates.py; fi

# =============================================================================
# DOCUMENTATION
# =============================================================================

docs:
	@echo "Building documentation..."
	@if [ -f package.json ]; then npm run docs:build; fi
	@if [ -f mkdocs.yml ]; then mkdocs build; fi

docs-serve:
	@echo "Serving documentation..."
	@if [ -f mkdocs.yml ]; then mkdocs serve; fi
	@if [ -f package.json ]; then npm run docs:serve; fi

# =============================================================================
# DOCKER
# =============================================================================

docker-build:
	@echo "Building Docker images..."
	docker build -t ai-skill-engineer:latest .
	docker build -t ai-skill-engineer:dev -f Dockerfile.dev .

docker-test:
	@echo "Testing Docker images..."
	docker run --rm ai-skill-engineer:latest --version
	docker run --rm ai-skill-engineer:dev --version

docker-push:
	@echo "Pushing Docker images..."
	docker tag ai-skill-engineer:latest $(REGISTRY)/ai-skill-engineer:$(VERSION)
	docker tag ai-skill-engineer:latest $(REGISTRY)/ai-skill-engineer:latest
	docker push $(REGISTRY)/ai-skill-engineer:$(VERSION)
	docker push $(REGISTRY)/ai-skill-engineer:latest

# =============================================================================
# RELEASE
# =============================================================================

VERSION := $(shell cat VERSION 2>/dev/null || echo "0.1.0")

release-patch:
	@echo "Bumping patch version..."
	@npm version patch --no-git-tag-version 2>/dev/null || true
	@echo $(shell echo $(VERSION) | awk -F. '{print $$1"."$$2"."$$3+1}') > VERSION
	@git add VERSION
	@git commit -m "chore: bump version to $(shell cat VERSION)"
	@git tag v$(shell cat VERSION)

release-minor:
	@echo "Bumping minor version..."
	@npm version minor --no-git-tag-version 2>/dev/null || true
	@echo $(shell echo $(VERSION) | awk -F. '{print $$1"."$$2+1".0"}') > VERSION
	@git add VERSION
	@git commit -m "chore: bump version to $(shell cat VERSION)"
	@git tag v$(shell cat VERSION)

release-major:
	@echo "Bumping major version..."
	@npm version major --no-git-tag-version 2>/dev/null || true
	@echo $(shell echo $(VERSION) | awk -F. '{print $$1+1".0.0"}') > VERSION
	@git add VERSION
	@git commit -m "chore: bump version to $(shell cat VERSION)"
	@git tag v$(shell cat VERSION)

# =============================================================================
# MAINTENANCE
# =============================================================================

clean:
	@echo "Cleaning build artifacts..."
	rm -rf node_modules
	rm -rf dist
	rm -rf build
	rm -rf coverage
	rm -rf .pytest_cache
	rm -rf .mypy_cache
	rm -rf .ruff_cache
	rm -rf .coverage
	rm -rf htmlcov
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	go clean -cache -modcache -testcache 2>/dev/null || true

update-deps:
	@echo "Updating dependencies..."
	@if [ -f package.json ]; then npm update; fi
	@if [ -f go.mod ]; then go get -u ./... && go mod tidy; fi
	@if [ -f pyproject.toml ]; then pip install --upgrade pip && pip install -U -r requirements.txt; fi

# =============================================================================
# CI HELPERS
# =============================================================================

ci-install: install
ci-lint: lint
ci-typecheck: typecheck
ci-test: test
ci-validate: validate

# =============================================================================
# PROJECT SPECIFIC
# =============================================================================

# Validate SPEC.md conformance
validate-spec:
	@echo "Validating SPEC.md conformance..."
	@if [ -f scripts/validate-spec.py ]; then python scripts/validate-spec.py; fi

# Generate skill scaffolding
generate-skill:
	@echo "Generating skill scaffold..."
	@if [ -f scripts/generate-skill.py ]; then python scripts/generate-skill.py $(SKILL_NAME); fi

# Render templates with sample data
render-templates:
	@echo "Rendering templates with sample data..."
	@if [ -f scripts/render-templates.py ]; then python scripts/render-templates.py; fi

# Check for TODO/FIXME comments
check-todos:
	@echo "Checking for TODO/FIXME comments..."
	@grep -r "TODO\|FIXME\|XXX\|HACK" --include="*.md" --include="*.ts" --include="*.go" --include="*.py" . | grep -v ".git" | grep -v "node_modules" || true

# Security audit
security-audit:
	@echo "Running security audit..."
	@if [ -f package.json ]; then npm audit --audit-level=high; fi
	@if [ -f go.mod ]; then govulncheck ./...; fi
	@if [ -f pyproject.toml ]; then pip-audit; fi
	@trufflehog filesystem . --no-verification