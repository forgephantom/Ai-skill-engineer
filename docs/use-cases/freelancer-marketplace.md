# Freelancer Marketplace — End-to-End Use Case

> **Idea:** *"A marketplace connecting freelance developers with non-technical founders"*
>
> **Project:** `freelancer-marketplace` · **ID:** `proj-a1b2c3d4`
>
> **Objective:** Demonstrate the complete 10-phase autonomous workflow from a single sentence to a production-ready delivery package.

---

## Table of Contents

1. [Project Initialization](#1-project-initialization)
2. [Phase 1 — Understand](#2-phase-1--understand)
3. [Phase 2 — Plan](#3-phase-2--plan)
4. [Phase 3 — Discover Skills](#4-phase-3--discover-skills)
5. [Phase 4 — Build](#5-phase-4--build)
6. [Phase 5 — Review](#6-phase-5--review)
7. [Phase 6 — Fix](#7-phase-6--fix)
8. [Phase 7 — Validate](#8-phase-7--validate)
9. [Phase 8 — Human Approval](#9-phase-8--human-approval)
10. [Phase 9 — Optimize](#10-phase-9--optimize)
11. [Phase 10 — Deliver](#11-phase-10--deliver)
12. [Delivery Package](#12-delivery-package)
13. [Resuming an Interrupted Workflow](#13-resuming-an-interrupted-workflow)

---

## 1. Project Initialization

### Command

```bash
ai-se init "A marketplace connecting freelance developers with non-technical founders" \
  --name freelancer-marketplace \
  --output ./output \
  --no-human-approval
```

### System Actions

| Step | Description |
|------|-------------|
| ID Generation | A unique project ID `proj-a1b2c3d4` is generated using UUID v4 |
| Directory Creation | Output directories are created at `./output/proj-a1b2c3d4/` |
| Config Setup | `project-config.json` is written with default settings |
| Skill Loading | All 24 built-in skill definitions are loaded from YAML files |
| State Initialization | The orchestrator initializes with phase 1 (`understand`) set as current |

### Terminal Output

```
✔ Project initialized: freelancer-marketplace (proj-a1b2c3d4)
```

### Project Structure

```
output/
└── proj-a1b2c3d4/
    ├── project-config.json
    └── state/
        └── latest.json
```

---

## 2. Phase 1 — Understand

**Skills executed in parallel:**

| Skill | Role | Input | Output |
|-------|------|-------|--------|
| **Business Analyst** | Requirements engineer | Raw idea text | Functional requirements, constraints, risks |
| **Product Strategist** | Product visionary | Raw idea text | Vision statement, business goals, success criteria |

### Artifacts Produced

```
artifacts/
├── vision.md
├── business-goals.json
├── functional-requirements.json
├── non-functional-requirements.json
├── constraints.json
├── risks.json
└── success-criteria.json
```

### Sample Artifact: vision.md

```markdown
# Product Vision

A digital marketplace that connects freelance software developers
with non-technical founders who need technical talent to build
their ideas. The platform handles discovery, vetting, project
management, escrow payments, and dispute resolution.
```

### Sample Artifact: functional-requirements.json

```json
{
  "requirements": [
    {
      "id": "FR-001",
      "description": "Freelancers can create profiles with skills, portfolio, and availability",
      "priority": "MUST",
      "acceptanceCriteria": [
        "Profile includes bio, skills tags, work history, and hourly rate",
        "Freelancer can upload portfolio items (links, images, descriptions)"
      ]
    },
    {
      "id": "FR-002",
      "description": "Founders can post project listings with budget and timeline",
      "priority": "MUST"
    },
    {
      "id": "FR-003",
      "description": "Integrated escrow payment system holds funds until milestones are completed",
      "priority": "MUST"
    },
    {
      "id": "FR-004",
      "description": "Messaging system for founders and freelancers to communicate",
      "priority": "MUST"
    },
    {
      "id": "FR-005",
      "description": "Rating and review system for both parties after project completion",
      "priority": "SHOULD"
    },
    {
      "id": "FR-006",
      "description": "AI-powered freelancer-to-project matching recommendations",
      "priority": "COULD"
    }
  ]
}
```

### Sample Artifact: risks.json

```json
{
  "risks": [
    {
      "id": "RSK-001",
      "description": "Escrow payment disputes between founders and freelancers",
      "likelihood": "MEDIUM",
      "impact": "HIGH",
      "mitigation": "Implement clear milestone-based release with mediation process"
    },
    {
      "id": "RSK-002",
      "description": "Fake profiles and fraudulent activity on the platform",
      "likelihood": "HIGH",
      "impact": "HIGH",
      "mitigation": "Identity verification, review system, AI fraud detection"
    }
  ]
}
```

### Terminal Output

```
  • Vision: A digital marketplace connecting freelance developers with non-technical founders
  • Functional Requirements: 12
  • Non-Functional Requirements: 8
  • Risks Identified: 5
✔ Phase 1/10: understand completed
```

---

## 3. Phase 2 — Plan

**Skills executed in parallel:**

| Skill | Role | Input | Output |
|-------|------|-------|--------|
| **Product Manager** | Feature definition | Understand artifacts | PRD, user stories, roadmap, milestones |
| **Solution Architect** | Technical design | Understand + requirements | Tech spec, ADRs, API contracts, data models |
| **Technical Writer** | Documentation | All plan artifacts | Documentation structure |

### All 47 User Stories by Epic

#### Epic: Freelancer Onboarding & Profiles

| ID | Title | As a... | I want to... | So that... |
|----|-------|---------|-------------|------------|
| US-001 | Freelancer registration | Freelance developer | sign up using my email or Google account | I can create an account and start building my profile |
| US-002 | Freelancer profile creation | Freelance developer | create a detailed profile showcasing my skills, experience, and portfolio | founders can discover and evaluate me for their projects |
| US-003 | Freelancer verification badges | Freelance developer | earn verified badges for identity, skills, and work history | I can stand out to founders and build trust |
| US-004 | Freelancer availability toggling | Freelance developer | toggle my availability status (available, busy, offline) | founders only see me when I am actively looking for work |
| US-005 | Freelancer earnings dashboard | Freelance developer | view my earnings, pending payments, and payout history | I can track my income and manage my finances |

**US-002 — Acceptance Criteria:**

```
• Profile includes: profile photo, bio, skill tags, years of experience, hourly rate, availability
• Skills selected from predefined taxonomy (languages, frameworks, cloud, etc.)
• Portfolio items can be uploaded (URL, description, image)
• Profile completion percentage shown — 100% required to appear in search
• Profile is public and searchable within 5 minutes of creation
```

---

#### Epic: Founder Onboarding & Project Posting

| ID | Title | As a... | I want to... | So that... |
|----|-------|---------|-------------|------------|
| US-006 | Founder registration | Non-technical founder | sign up and create a company profile | I can post projects and hire freelancers |
| US-007 | Post a new project | Founder | create a detailed project listing with description, budget, timeline, and required skills | qualified freelancers can apply to work on my project |
| US-008 | Project listing review | Founder | review my project listing before it goes live | I can ensure accuracy before freelancers see it |
| US-009 | Founder dashboard | Founder | see all my active and past projects in one place | I can track progress and manage my hiring activity |

**US-007 — Acceptance Criteria:**

```
• Project form: title, description, scope, budget range, timeline, required skills
• Budget options: fixed price or hourly with estimated hours
• Milestone support: divide project into milestones with deliverables and payment amounts
• Attachments: upload brief, wireframes, or existing code
• Draft save before publishing
```

---

#### Epic: Search & Discovery

| ID | Title | As a... | I want to... | So that... |
|----|-------|---------|-------------|------------|
| US-010 | Freelancer search | Founder | search for freelancers by skill, rate, availability, and rating | I can find the best match for my project |
| US-011 | Project search | Freelance developer | browse and search projects by skills, budget, and timeline | I can find projects that match my expertise |
| US-012 | Recommended matches | Freelance developer | receive recommended projects based on my skills and history | I can find relevant opportunities without manual searching |

**US-010 — Acceptance Criteria:**

```
• Full-text search across name, bio, skills, and portfolio
• Filters: skill tags, hourly rate range, availability, rating minimum, location
• Sort by: relevance, rating, price low-high, price high-low, most projects completed
• Results show profile card with photo, name, skills, rate, rating, and badges
• Pagination and debounced search (300ms delay)
```

---

#### Epic: Applications & Hiring

| ID | Title | As a... | I want to... | So that... |
|----|-------|---------|-------------|------------|
| US-013 | Apply to a project | Freelance developer | submit a proposal with my rate, availability, and a cover letter | the founder can evaluate and hire me |
| US-014 | Review and shortlist applicants | Founder | view all applications, compare freelancers, and shortlist top candidates | I can make an informed hiring decision |
| US-015 | Hire a freelancer | Founder | send a hiring offer with agreed terms | we can formalize the engagement and begin work |
| US-016 | Freelancer acceptance of offer | Freelance developer | review and accept or negotiate a hiring offer | I can start working on terms that work for me |

**US-015 — Acceptance Criteria:**

```
• Offer form: agreed rate, start date, milestone plan
• Freelancer can accept, counter, or decline the offer
• Contract auto-generated upon acceptance
• Escrow account created with initial milestone funds
```

---

#### Epic: Project Workspace & Collaboration

| ID | Title | As a... | I want to... | So that... |
|----|-------|---------|-------------|------------|
| US-017 | Project workspace | Freelance developer | have a shared workspace with task tracking, file sharing, and messaging | I can collaborate efficiently with the founder |
| US-018 | Milestone tracking | Founder | track milestone progress and approve completed deliverables | I can release payments only when work meets my expectations |
| US-019 | In-platform messaging | User (both roles) | send direct messages and receive notifications | I can communicate without sharing personal contact details |

**US-017 — Acceptance Criteria:**

```
• Task board: columns for To Do, In Progress, Review, Done
• File sharing: upload and organize project files with version history
• Messaging: real-time chat with message history and file attachments
• Activity feed: shows all recent changes, messages, and milestone completions
```

---

#### Epic: Payments & Escrow

| ID | Title | As a... | I want to... | So that... |
|----|-------|---------|-------------|------------|
| US-020 | Escrow payment deposit | Founder | deposit project funds into an escrow account | the freelancer knows payment is secured before starting work |
| US-021 | Milestone payment release | Founder | approve and release payment for completed milestones | the freelancer gets paid for completed work |
| US-022 | Dispute resolution | User (both roles) | open a dispute if there is a disagreement about deliverables or payment | the platform can mediate and reach a fair resolution |

**US-022 — Acceptance Criteria:**

```
• Dispute can be opened within 14 days of milestone submission
• Both parties can submit evidence (messages, files, screenshots)
• Mediation timeline: 7 days for resolution
• Resolution options: full payment, partial payment, refund, or milestone revision
```

---

#### Epic: Reviews & Reputation

| ID | Title | As a... | I want to... | So that... |
|----|-------|---------|-------------|------------|
| US-023 | Rate a freelancer | Founder | leave a rating and written review after project completion | other founders can benefit from my experience |
| US-024 | Rate a founder | Freelance developer | rate my experience working with a founder | other freelancers can assess founder reliability |
| US-025 | Top-rated freelancer badge | Freelance developer | earn a Top Rated badge after completing 10+ projects with 4.5+ average rating | I can attract higher-quality projects |

**US-023 — Acceptance Criteria:**

```
• Star rating 1-5 with required written review
• Categories: quality, communication, timeliness, budget adherence
• Review visible on freelancer profile after both parties review or 14 days pass
```

---

#### Epic: Admin & Moderation

| ID | Title | As a... | I want to... | So that... |
|----|-------|---------|-------------|------------|
| US-026 | Flag inappropriate content | User (both roles) | flag projects, profiles, or messages that violate platform rules | the moderation team can review and take action |
| US-027 | Admin user management | Platform admin | view, suspend, or ban users and review dispute cases | I can maintain platform integrity and enforce terms of service |

---

#### Epic: Notifications & Communications

| ID | Title | As a... | I want to... | So that... |
|----|-------|---------|-------------|------------|
| US-028 | Email notifications | User (both roles) | receive email notifications for key events | I stay informed without constantly checking the platform |
| US-029 | In-app notification center | User (both roles) | see all my notifications in one place within the app | I can review past notifications |

---

#### Epic: Mobile & Cross-Platform

| ID | Title | As a... | I want to... | So that... |
|----|-------|---------|-------------|------------|
| US-030 | Responsive web design | User (both roles) | use the platform on my mobile browser with full functionality | I can manage projects on the go |
| US-031 | Push notifications | User (both roles) | receive push notifications on my mobile device | I get alerted to important events even when the browser tab is closed |

---

#### Epic: Security & Compliance

| ID | Title | As a... | I want to... | So that... |
|----|-------|---------|-------------|------------|
| US-032 | Two-factor authentication | User (both roles) | enable two-factor authentication on my account | my account is protected even if my password is compromised |
| US-033 | Data export | User (both roles) | export all my data (profile, messages, transaction history) | I have a copy of my information as required by GDPR |
| US-034 | Account deletion | User (both roles) | permanently delete my account and all associated data | I can remove my presence from the platform |

---

#### Epic: AI-Powered Features

| ID | Title | As a... | I want to... | So that... |
|----|-------|---------|-------------|------------|
| US-035 | AI skill matching | Founder | see AI-recommended freelancers ranked by compatibility score | I can quickly find the best candidates without manually reviewing every application |
| US-036 | AI project scope suggestion | Founder | AI to suggest milestone breakdowns based on my project description | I can create realistic project scopes even if I am not technical |
| US-037 | AI fraud detection | Platform admin | the system to automatically detect suspicious activity patterns | fraudulent accounts and scams are flagged before they harm users |

---

#### Epic: Reports & Analytics

| ID | Title | As a... | I want to... | So that... |
|----|-------|---------|-------------|------------|
| US-038 | Platform analytics dashboard | Platform admin | view platform-wide metrics (users, projects, revenue, disputes) | I can monitor growth and identify issues proactively |
| US-039 | Freelancer earnings report | Freelance developer | generate a PDF earnings report for tax purposes | I can easily file my taxes |

---

#### Epic: Platform Settings & Customization

| ID | Title | As a... | I want to... | So that... |
|----|-------|---------|-------------|------------|
| US-040 | Custom notification rules | User (both roles) | create custom notification rules (e.g., only notify me for projects over $5,000) | I only receive alerts that matter to me |
| US-041 | Language and currency preferences | User (both roles) | set my preferred language and currency in account settings | the platform displays content in my preferred format |

---

#### Epic: Onboarding & Tutorials

| ID | Title | As a... | I want to... | So that... |
|----|-------|---------|-------------|------------|
| US-042 | Freelancer onboarding wizard | New freelance developer | complete a step-by-step onboarding wizard | I can set up my profile, verify my identity, and apply to my first project quickly |
| US-043 | Founder onboarding wizard | New founder | complete a guided setup for posting my first project | I can get started even if I have never hired freelancers before |

---

#### Epic: API & Integrations

| ID | Title | As a... | I want to... | So that... |
|----|-------|---------|-------------|------------|
| US-044 | Public API for project listings | External developer | access project listings via a REST API | I can build third-party tools and integrations |
| US-045 | Slack integration | Founder | receive project notifications in a Slack channel | my team stays updated without checking the platform |
| US-046 | Calendar sync | Freelance developer | sync project milestones and deadlines to my Google Calendar | I never miss a deadline |

---

#### Epic: Gamification & Engagement

| ID | Title | As a... | I want to... | So that... |
|----|-------|---------|-------------|------------|
| US-047 | Freelancer achievement badges | Freelance developer | earn achievement badges for completing milestones like first project, 10 projects, $10k earned | I feel recognized and motivated to stay active |

### Summary Statistics

```
  • User Stories: 47
  • Acceptance Criteria: 142
  • Milestones: 6
  • Roadmap Phases: 4
✔ Phase 2/10: plan completed
```

---

## 4. Phase 3 — Discover Skills

**Skill:** Skill Discovery Engine

### Actions

1. Analyzes the 47 user stories and technical specification from Phase 2
2. Determines which of the 24 built-in skills are required for this project
3. Reads the dependency declarations in each skill's `skill.yaml` file
4. Resolves the dependency graph into a DAG (Directed Acyclic Graph)
5. Groups independent skills into parallel execution cohorts
6. Estimates total build duration based on artifact counts and complexity

### Dependency DAG

```
UX Designer ──► UI Designer ──► Frontend Engineer
                                        │
Security Engineer ──────────────────────┤
                                        │
                    Database Engineer ──► Backend Engineer
                                        │
                              AI Engineer
                                        │
                    Cloud Engineer ─────► DevOps Engineer ──► QA Engineer
```

### Parallel Execution Groups

| Group | Skills | Rationale |
|-------|--------|-----------|
| 1 | UX Designer, Security Engineer | No dependencies — can start immediately |
| 2 | UI Designer, Database Engineer | Depend on UX (wireframes) and Security (threat model) |
| 3 | Frontend, Backend, AI Engineer | Depend on UI (mockups) and DB (schema) |
| 4 | Cloud Engineer, DevOps, QA Engineer | Depend on all code artifacts |

### Terminal Output

```
  • Skills Discovered: 12
    - UX Designer, UI Designer, Frontend Engineer, Backend Engineer,
      Database Engineer, AI Engineer, Security Engineer, Cloud Engineer,
      DevOps Engineer, QA Engineer, Documentation Engineer, Mobile Engineer
  • Parallel Groups: 4
  • Estimated Duration: 45m
✔ Phase 3/10: discover-skills completed
```

---

## 5. Phase 4 — Build

**Skills:** 12 skills executed across 4 DAG-resolved parallel groups.

### Execution Plan

| Group | Skills | Key Artifacts | Estimated Output |
|-------|--------|---------------|-----------------|
| 1 | UX Designer | Wireframes, user flow diagrams, interaction specifications | 12 artifacts |
| 1 | Security Engineer | Threat model, authentication flow, encryption strategy | 8 artifacts |
| 2 | UI Designer | High-fidelity mockups, design system, component library | 15 artifacts |
| 2 | Database Engineer | Schema, migrations, indexes, query optimization plan | 10 artifacts |
| 3 | Frontend Engineer | React application, components, routing, state management | 45 artifacts |
| 3 | Backend Engineer | API endpoints, middleware, business logic, validation | 35 artifacts |
| 3 | AI Engineer | Matching algorithm, recommendation engine, fraud detection model | 10 artifacts |
| 4 | Cloud Engineer | Infrastructure as code, networking, auto-scaling configuration | 8 artifacts |
| 4 | DevOps Engineer | CI/CD pipelines, Docker configuration, monitoring stack | 8 artifacts |
| 4 | QA Engineer | Test plans, E2E test suites, load test scripts | 10 artifacts |

### Sample Build Artifact: API Endpoint (backend)

```typescript
// src/backend/routes/milestones.ts
import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { MilestoneService } from '../services/MilestoneService';
import { EscrowService } from '../services/EscrowService';

const router = Router();
const milestoneService = new MilestoneService();
const escrowService = new EscrowService();

/**
 * POST /api/projects/:projectId/milestones
 * Create a new milestone within a project
 */
router.post('/:projectId/milestones', authenticate, async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { title, description, deliverables, amount, dueDate } = req.body;

  const milestone = await milestoneService.create({
    projectId,
    title,
    description,
    deliverables,
    amount,
    dueDate,
    createdBy: req.user.id,
  });

  res.status(201).json(milestone);
});

/**
 * POST /api/milestones/:milestoneId/submit
 * Freelancer submits a milestone deliverable for review
 */
router.post('/milestones/:milestoneId/submit', authenticate, async (req: Request, res: Response) => {
  const { milestoneId } = req.params;
  const { notes, attachments } = req.body;

  const milestone = await milestoneService.submitForReview(milestoneId, {
    submittedBy: req.user.id,
    notes,
    attachments,
  });

  res.json(milestone);
});

/**
 * POST /api/milestones/:milestoneId/approve
 * Founder approves a completed milestone and releases payment
 */
router.post('/milestones/:milestoneId/approve', authenticate, async (req: Request, res: Response) => {
  const { milestoneId } = req.params;

  const milestone = await milestoneService.approve(milestoneId, req.user.id);
  await escrowService.releasePayment(milestone.projectId, milestone.amount);

  res.json({
    milestone,
    payment: { status: 'released', amount: milestone.amount },
  });
});

export default router;
```

### Sample Build Artifact: Database Migration

```sql
-- src/database/migrations/V004__create_milestones_table.sql
CREATE TABLE milestones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    deliverables    JSONB,
    amount          DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'in_progress', 'submitted', 'approved', 'paid')),
    due_date        TIMESTAMP WITH TIME ZONE,
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_milestones_project_id ON milestones(project_id);
CREATE INDEX idx_milestones_status ON milestones(status);
CREATE INDEX idx_milestones_due_date ON milestones(due_date);
```

### Sample Build Artifact: React Component (frontend)

```tsx
// src/frontend/components/MilestoneTracker.tsx
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { api } from '../services/api';
import type { Milestone } from '../types';

const STATUS_COLUMNS = [
  { id: 'pending', label: 'Pending' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'submitted', label: 'Review' },
  { id: 'approved', label: 'Approved' },
  { id: 'paid', label: 'Paid' },
];

interface Props {
  projectId: string;
  role: 'founder' | 'freelancer';
}

export const MilestoneTracker: React.FC<Props> = ({ projectId, role }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    api.getMilestones(projectId).then(setMilestones);
  }, [projectId]);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const milestoneId = result.draggableId;
    const newStatus = result.destination.droppableId;

    await api.updateMilestoneStatus(milestoneId, newStatus);
    setMilestones(prev =>
      prev.map(m => m.id === milestoneId ? { ...m, status: newStatus } : m)
    );
  };

  const getColumnMilestones = (status: string) =>
    milestones.filter(m => m.status === status);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUS_COLUMNS.map(column => (
          <div key={column.id} className="flex-1 min-w-[200px]">
            <h3 className="font-semibold mb-2 text-gray-700">
              {column.label}
              <span className="ml-2 text-sm text-gray-400">
                ({getColumnMilestones(column.id).length})
              </span>
            </h3>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-50 rounded-lg p-3 min-h-[200px]"
                >
                  {getColumnMilestones(column.id).map((milestone, index) => (
                    <Draggable
                      key={milestone.id}
                      draggableId={milestone.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white rounded shadow p-3 mb-2"
                        >
                          <h4 className="font-medium">{milestone.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            ${milestone.amount.toLocaleString()}
                          </p>
                          {milestone.dueDate && (
                            <p className="text-xs text-gray-400 mt-1">
                              Due: {new Date(milestone.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
```

### Terminal Output

```
  • Artifacts Created: 156
  • Skills Executed: 12
✔ Phase 4/10: build completed
```

---

## 6. Phase 5 — Review

**Skill:** Code Reviewer

### Review Criteria

| Dimension | Weight | Description |
|-----------|--------|-------------|
| Correctness | 25% | Logic errors, edge cases, input validation, error handling |
| Architecture | 20% | Design patterns, separation of concerns, scalability |
| Security | 20% | OWASP Top 10, authentication, authorization, data sanitization |
| Performance | 15% | Query optimization, caching, bundle size, rendering efficiency |
| Maintainability | 10% | Code organization, naming conventions, documentation |
| Test Coverage | 10% | Unit test coverage, integration tests, edge cases |

### Findings

```
  • Findings: 23
  • Blockers: 2
    - API endpoint /api/escrow/pay lacks input validation
    - Database migration V003 contains a non-indexed foreign key
  • High: 7
    - Missing rate limiting on authentication endpoints
    - SQL injection risk in search query builder
    - No CSRF protection on payment endpoints
    - React components missing error boundaries
    - API responses expose internal error stack traces
    - No pagination on freelancer search results
    - Missing data encryption at rest for PII fields
  • Medium: 9
  • Low: 5
  • Auto-fixable: 15
✔ Phase 5/10: review completed
```

---

## 7. Phase 6 — Fix

**Skill:** Code Fixer

### Fix Strategy

| Category | Count | Approach |
|----------|-------|----------|
| Auto-fixed | 15 | Automated code transformation, dependency updates, config changes |
| Failed | 0 | No fix attempts resulted in regression test failure |
| Escalated | 2 | Requires human judgment on business logic trade-offs |

### Escalated Items

| ID | Issue | Reason | Recommendation |
|----|-------|--------|----------------|
| BLK-001 | Escrow pay endpoint missing input validation | Fix requires defining valid payment states | Add Zod schema validation: `z.object({ milestoneId: z.string().uuid(), amount: z.number().positive() })` |
| BLK-002 | Non-indexed foreign key in migration V003 | Indexing strategy depends on query patterns | Add composite index: `CREATE INDEX idx_milestones_project_status ON milestones(project_id, status)` |

### Terminal Output

```
  • Fixed: 15
  • Failed: 0
  • Escalated: 2
✔ Phase 6/10: fix completed
```

---

## 8. Phase 7 — Validate

**Skill:** Validation Engine

### Validation Stages

| Stage | Tool | Command | Result |
|-------|------|---------|--------|
| Type Checking | TypeScript | `tsc --noEmit` | ✅ Pass — 0 errors |
| Linting | ESLint | `eslint src --ext .ts` | ✅ Pass — 0 errors |
| Security Scan | npm audit | `npm audit --audit-level=high` | ✅ Pass — 0 critical, 0 high |
| Performance | Lighthouse CI | `lighthouse-ci https://staging.example.com` | ✅ Pass — p95 < 200ms |
| Accessibility | axe-core | `axe --chrome-options="--headless"` | ✅ Pass — 0 violations |
| Contract Tests | SuperTest | `jest tests/contract` | ✅ Pass — 42/42 endpoints |

### Terminal Output

```
  • Stages: 6
  • Passed: 6
  • Failed: 0
✔ Phase 7/10: validate completed
```

---

## 9. Phase 8 — Human Approval

**Skill:** Principal Engineer Simulator

### Review Summary

```
┌─────────────────────────────────────────────────────────────┐
│  Project: freelancer-marketplace (proj-a1b2c3d4)            │
├─────────────────────────────────────────────────────────────┤
│  Phase 1: Understand        ✅  5 artifacts                  │
│  Phase 2: Plan             ✅  47 user stories, 6 milestones │
│  Phase 3: Discover Skills  ✅  12 skills, 4 parallel groups  │
│  Phase 4: Build            ✅  156 artifacts                 │
│  Phase 5: Review           ✅  23 findings (2 blockers)      │
│  Phase 6: Fix              ✅  15/15 auto-fixed, 2 escalated│
│  Phase 7: Validate         ✅  6/6 stages passed             │
├─────────────────────────────────────────────────────────────┤
│  Escalated Items: 2                                          │
│  • Escrow input validation (BLOCKER)                         │
│  • Database index strategy (BLOCKER)                         │
└─────────────────────────────────────────────────────────────┘
```

### Terminal Output (Auto Mode)

```
  • Decision: APPROVED
  • Reviewer: auto-approved
✔ Phase 8/10: human-approval completed
```

---

## 10. Phase 9 — Optimize

**Skill:** Optimization Engine (3 iterations)

### Iteration Details

| Iteration | Focus Areas | Improvement |
|-----------|-------------|-------------|
| 1 — Low-hanging fruit | Bundle splitting, image optimization, lazy loading, HTTP caching headers | +8.2% |
| 2 — Structural changes | Database read replicas, connection pooling, CDN configuration, auto-scaling policies | +9.5% |
| 3 — Fine-tuning | Memory allocation, query plan analysis, cache hit ratio tuning, compression levels | +5.3% |

### Optimization Examples

**Before — Monolithic bundle:**
```javascript
// Single import pulls in entire component library
import { Button, Card, Modal, Table, Form, Input, Select, DatePicker } from 'antd';
```

**After — Code-split imports:**
```javascript
// Dynamic imports reduce initial bundle by 340KB
const Button = dynamic(() => import('antd/es/button'));
const Card = dynamic(() => import('antd/es/card'));
const Modal = dynamic(() => import('antd/es/modal'));
```

**Before — N+1 query pattern:**
```sql
-- For each project, query milestones separately
SELECT * FROM milestones WHERE project_id = $1;
```

**After — Batch query with join:**
```sql
SELECT p.*, json_agg(m.*) AS milestones
FROM projects p
LEFT JOIN milestones m ON m.project_id = p.id
WHERE p.founder_id = $1
GROUP BY p.id;
```

### Terminal Output

```
  • Iteration 1: +8.2% improvement (low-hanging fruit)
  • Iteration 2: +9.5% improvement (structural changes)
  • Iteration 3: +5.3% improvement (fine-tuning)
  • Total Improvement: 23.0%
✔ Phase 9/10: optimize completed
```

---

## 11. Phase 10 — Deliver

**Skill:** Delivery Engineer

### Delivery Package Structure

```
delivery/
├── README.md
├── docs/
│   ├── architecture.md
│   ├── api-reference.md
│   ├── deployment-guide.md
│   ├── monitoring.md
│   └── runbook.md
├── src/
│   ├── frontend/                  # React 18 + TypeScript
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── styles/
│   ├── backend/                   # Node.js + Express + TypeScript
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── models/
│   │   └── validators/
│   ├── mobile/                    # React Native
│   │   └── ...
│   └── ai/                        # Python + scikit-learn
│       ├── matching/
│       ├── fraud-detection/
│       └── scheduling/
├── tests/
│   ├── unit/                      # 340 tests
│   ├── integration/               # 85 tests
│   └── e2e/                       # 22 tests (Playwright)
├── infra/
│   ├── terraform/
│   │   ├── modules/
│   │   ├── environments/
│   │   │   ├── dev/
│   │   │   ├── staging/
│   │   │   └── prod/
│   │   └── main.tf
│   ├── docker/
│   │   ├── Dockerfile.frontend
│   │   ├── Dockerfile.backend
│   │   └── docker-compose.yml
│   └── kubernetes/
│       ├── deployment.yaml
│       ├── service.yaml
│       ├── ingress.yaml
│       └── hpa.yaml
├── monitoring/
│   ├── grafana/
│   │   └── dashboards/
│   └── prometheus/
│       └── rules/
├── scripts/
│   ├── setup.sh
│   ├── deploy.sh
│   ├── rollback.sh
│   └── seed-data.sh
└── .github/
    └── workflows/
        ├── ci.yml
        └── deploy.yml
```

### Terminal Output

```
  • Package: 234 items
  • Size: 12.4 MB

╔════════════════════════════════════════════════════════════╗
║              WORKFLOW COMPLETED SUCCESSFULLY               ║
╚════════════════════════════════════════════════════════════╝

Delivery package created at:
  ./output/proj-a1b2c3d4/delivery/
```

---

## 12. Delivery Package

### Inspect the Output

```bash
ls -la ./output/proj-a1b2c3d4/delivery/
tree ./output/proj-a1b2c3d4/delivery/
```

### Key Metrics

| Metric | Value |
|--------|-------|
| Total artifacts | 234 |
| Delivery size | 12.4 MB |
| Source files | 156 |
| Test files | 447 (340 unit + 85 integration + 22 e2e) |
| Infrastructure files | 28 |
| Documentation files | 12 |
| Automation scripts | 8 |
| CI/CD workflows | 2 |

---

## 13. Resuming an Interrupted Workflow

If the process is interrupted mid-way (Ctrl+C, system crash, network failure), state is persisted to disk at the end of each phase.

### Resume Command

```bash
ai-se resume --project ./output/proj-a1b2c3d4 --no-human-approval
```

### State Persistence Details

| Persisted Data | Location | Format |
|----------------|----------|--------|
| Current phase index | `state/latest.json` | JSON |
| Completed artifacts | `artifacts/` | Files |
| Phase statuses | `state/latest.json` | JSON |
| Project configuration | `project-config.json` | JSON |
| Skill execution results | `state/latest.json` | JSON |

### Example State File

```json
{
  "projectId": "proj-a1b2c3d4",
  "currentPhase": 5,
  "phases": {
    "understand": "completed",
    "plan": "completed",
    "discover-skills": "completed",
    "build": "completed",
    "review": "completed",
    "fix": "pending",
    "validate": "pending",
    "human-approval": "pending",
    "optimize": "pending",
    "deliver": "pending"
  },
  "artifacts": {
    "understand": ["vision.md", "business-goals.json", "functional-requirements.json", ...],
    "plan": ["prd.md", "user-stories.json", "tech-spec.md", ...],
    "build": ["src/frontend/App.tsx", "src/backend/routes/milestones.ts", ...]
  },
  "updatedAt": "2026-07-09T04:27:14.384Z"
}
```

---

## Additional Examples

### Running Multiple Projects

```bash
ai-se init "B2B SaaS for automated compliance reporting" -n compliance-saas -o ./projects
ai-se init "Fitness tracking app with AI coaching" -n fitness-app -o ./projects
ai-se run --project ./projects/proj-xxx1 --no-human-approval
ai-se run --project ./projects/proj-xxx2 --no-human-approval
```

### Using Validation Gates in CI

```bash
ai-se validate --project ./output/proj-a1b2c3d4 --level strict
```

### Interactive Initialization

```bash
ai-se init
```

---

## Related Documentation

- [Installation Guide](../installation.md)
- [CLI Reference](../cli-reference.md)
- [Workflow Phases](../workflow-phases.md)
- [Skill Executors](../skill-executors.md)
- [Custom Skills](../custom-skills.md)
- [Configuration](../configuration.md)
- [Full Walkthrough](../walkthrough.md)
