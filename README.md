<picture>
  <source media="(prefers-color-scheme: dark)" srcset="media/banner.svg">
  <img alt="AI Skill Engineer" src="media/banner.svg" width="100%">
</picture>

<br>

<div align="center">

# AI Skill Engineer

> **Transform a single human idea into a complete, production-ready application — autonomously.**

<br>

[![GitHub stars](https://img.shields.io/github/stars/forgephantom/Ai-skill-engineer?style=for-the-badge&logo=github&color=blue&label=Stars)](https://github.com/forgephantom/Ai-skill-engineer/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/forgephantom/Ai-skill-engineer?style=for-the-badge&logo=github&color=blue&label=Forks)](https://github.com/forgephantom/Ai-skill-engineer/forks)
[![CI](https://img.shields.io/github/actions/workflow/status/forgephantom/Ai-skill-engineer/ci.yml?style=for-the-badge&logo=githubactions&label=CI)](https://github.com/forgephantom/Ai-skill-engineer/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-for-the-badge?logo=typescript&color=3178C6)](https://www.typescriptlang.org)
[![Node](https://img.shields.io/badge/Node-20%2B-for-the-badge?logo=node.js&color=339933)](https://nodejs.org)

[![Release](https://img.shields.io/github/v/release/forgephantom/Ai-skill-engineer?style=for-the-badge&logo=github&label=Release)](https://github.com/forgephantom/Ai-skill-engineer/releases)
[![License](https://img.shields.io/badge/License-MIT-for_the_badge?color=green)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/forgephantom/Ai-skill-engineer?style=for-the-badge&logo=github&color=blue)](https://github.com/forgephantom/Ai-skill-engineer/commits/main)
[![Open Issues](https://img.shields.io/github/issues/forgephantom/Ai-skill-engineer?style=for-the-badge&logo=github&color=yellow)](https://github.com/forgephantom/Ai-skill-engineer/issues)
[![Open PRs](https://img.shields.io/github/issues-pr/forgephantom/Ai-skill-engineer?style=for-the-badge&logo=github&color=brightgreen)](https://github.com/forgephantom/Ai-skill-engineer/pulls)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-for_the_badge?color=brightgreen)](CONTRIBUTING.md)

<br>

**🏆 Orchestrate 24 AI engineering roles | 10-phase autonomous workflow | Plug any LLM provider**

</div>

---

## Why AI Skill Engineer?

Unlike code assistants that generate snippets, AI Skill Engineer runs a **complete multi-skill, multi-phase engineering workflow** — from idea to production-ready delivery package.

```
Idea → Understand → Plan → Discover Skills → Build → Review → Fix → Validate → Approve → Optimize → Deliver
```

| What makes it different | |
|------------------------|-|
| **24 simulated expert roles** | Product strategists, solution architects, frontend/backend/AI engineers, security, QA, DevOps, and more |
| **DAG-based parallel execution** | Skills run in dependency-respecting parallel groups |
| **State persistence** | Resume from the last completed phase — no data loss |
| **Validation pipeline** | Type-checking, linting, security scanning, performance tests built in |
| **Pluggable executors** | Connect any LLM provider (OpenAI, Anthropic, Ollama, etc.) via a simple interface |
| **Delivery packaging** | Complete project with architecture docs, code, tests, deployment, and runbooks |

---

## Quick Start

```bash
git clone https://github.com/forgephantom/Ai-skill-engineer.git
cd Ai-skill-engineer && npm install && npm run build && npm link
ai-se init "Build a SaaS platform for compliance reporting"
ai-se run --project <project-id>
```

[📖 Full walkthrough with sample output →](docs/walkthrough.md)

---

## Step-by-Step Guide

### 1. [Installation](docs/installation.md)

Prerequisites, cloning, dependency installation, building, and linking the CLI.

**Example:**
```bash
git clone https://github.com/forgephantom/Ai-skill-engineer.git
cd Ai-skill-engineer
npm install
npm run build
npm link
ai-se doctor    # Verify everything works
```

### 2. [Initialize a Project](docs/cli-reference.md#init--initialize-a-new-project)

Turn your idea into a structured project with a single command.

**Example:**
```bash
ai-se init "A marketplace connecting freelance developers with non-technical founders" \
  --name freelancer-marketplace \
  --output ./projects \
  --no-human-approval
```

### 3. [Run the Workflow](docs/cli-reference.md#run--execute-the-workflow)

Execute all 10 phases autonomously.

**Example:**
```bash
ai-se run --project proj-a1b2c3d4 --no-human-approval
```

### 4. [Monitor & Resume](docs/cli-reference.md#status--show-project-state)

Check status or resume an interrupted workflow.

**Example:**
```bash
ai-se status --project proj-a1b2c3d4
ai-se resume --project proj-a1b2c3d4
```

---

## End-to-End Example: Freelancer Marketplace

This example walks through a complete run using the idea:

> *"A marketplace connecting freelance developers with non-technical founders"*

**Project:** `freelancer-marketplace` (ID: `proj-a1b2c3d4`)

### Step 1: Initialize

```bash
ai-se init "A marketplace connecting freelance developers with non-technical founders" \
  --name freelancer-marketplace \
  --output ./output \
  --no-human-approval
```

**What happens:**
- A unique ID `proj-a1b2c3d4` is generated
- Output directory `./output/proj-a1b2c3d4/` is created
- All 24 skill definitions are loaded from YAML
- Orchestrator starts at phase 1 (`understand`)

**Output:**
```
✔ Project initialized: freelancer-marketplace (proj-a1b2c3d4)
```

---

### Step 2: Run the Workflow

```bash
ai-se run --project ./output/proj-a1b2c3d4 --no-human-approval
```

The system executes all 10 phases. Here is the annotated output for each:

---

### Phase 1/10: Understand

**Skills:** Business Analyst, Product Strategist (parallel)

**What they do:**
- **Business Analyst** reads the idea text and extracts structured requirements, constraints, and risks
- **Product Strategist** reads the idea text and defines the vision, business goals, and success criteria

**Artifacts produced:**
```
artifacts/
├── vision.md                    # Product vision statement
├── business-goals.json          # Measurable business objectives
├── functional-requirements.json # Feature requirements with priorities
├── non-functional-requirements.json
├── constraints.json
├── risks.json
└── success-criteria.json
```

**Detailed example output (vision.md):**
```markdown
# Product Vision

A digital marketplace that connects freelance software developers
with non-technical founders who need technical talent to build
their ideas. The platform handles discovery, vetting, project
management, escrow payments, and dispute resolution.
```

**Detailed example output (functional-requirements.json):**
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
    }
  ]
}
```

**Terminal output:**
```
✔ Phase 1/10: understand completed
  • Vision: A digital marketplace connecting freelance developers with non-technical founders
  • Functional Requirements: 12
  • Non-Functional Requirements: 8
  • Risks Identified: 5
```

---

### Phase 2/10: Plan

**Skills:** Product Manager, Solution Architect, Technical Writer (parallel)

**What they do:**
- **Product Manager** takes the Understand artifacts and produces a PRD, user stories, roadmap, and milestones
- **Solution Architect** produces a technical specification, Architecture Decision Records, API contracts, and data models
- **Technical Writer** structures all documentation

**Detailed example output — User Stories:**
```
  • User Stories: 47
  • Acceptance Criteria: 142
  • Milestones: 6
  • Roadmap Phases: 4
```

**All 47 user stories organized by epic — full content (user-stories.json):**

```json
{
  "epics": [
    {
      "epic": "Freelancer Onboarding & Profiles",
      "stories": [
        {
          "id": "US-001",
          "title": "Freelancer registration",
          "as_a": "Freelance developer",
          "i_want": "to sign up using my email or Google account",
          "so_that": "I can create an account and start building my profile",
          "acceptance_criteria": [
            "Sign up with email/password or Google OAuth",
            "Email verification required before profile is public",
            "Password must be at least 8 characters with 1 number and 1 special character"
          ]
        },
        {
          "id": "US-002",
          "title": "Freelancer profile creation",
          "as_a": "Freelance developer",
          "i_want": "to create a detailed profile showcasing my skills, experience, and portfolio",
          "so_that": "founders can discover and evaluate me for their projects",
          "acceptance_criteria": [
            "Profile includes: profile photo, bio, skill tags, years of experience, hourly rate, availability",
            "Skills selected from predefined taxonomy (languages, frameworks, cloud, etc.)",
            "Portfolio items can be uploaded (URL, description, image)",
            "Profile completion percentage shown — 100% required to appear in search",
            "Profile is public and searchable within 5 minutes of creation"
          ]
        },
        {
          "id": "US-003",
          "title": "Freelancer verification badges",
          "as_a": "Freelance developer",
          "i_want": "to earn verified badges for identity, skills, and work history",
          "so_that": "I can stand out to founders and build trust",
          "acceptance_criteria": [
            "Identity verification via government ID upload",
            "Skill verification via coding challenge or certification upload",
            "Work history verification via founder reviews",
            "Badges displayed prominently on profile card"
          ]
        },
        {
          "id": "US-004",
          "title": "Freelancer availability toggling",
          "as_a": "Freelance developer",
          "i_want": "to toggle my availability status (available, busy, offline)",
          "so_that": "founders only see me when I am actively looking for work",
          "acceptance_criteria": [
            "Three states: Available, Busy (on a project), Offline",
            "Available freelancers appear in search results first",
            "Busy freelancers show expected availability date"
          ]
        },
        {
          "id": "US-005",
          "title": "Freelancer earnings dashboard",
          "as_a": "Freelance developer",
          "i_want": "to view my earnings, pending payments, and payout history",
          "so_that": "I can track my income and manage my finances",
          "acceptance_criteria": [
            "Dashboard shows: total earned, pending balance, next payout date",
            "Transaction history with filters (date range, status, project)",
            "Payout methods: bank transfer, PayPal, Stripe",
            "Monthly earning summary chart"
          ]
        }
      ]
    },
    {
      "epic": "Founder Onboarding & Project Posting",
      "stories": [
        {
          "id": "US-006",
          "title": "Founder registration",
          "as_a": "Non-technical founder",
          "i_want": "to sign up and create a company profile",
          "so_that": "I can post projects and hire freelancers",
          "acceptance_criteria": [
            "Sign up with email or Google/LinkedIn OAuth",
            "Company profile: name, website, industry, team size, funding stage",
            "LinkedIn import for company details"
          ]
        },
        {
          "id": "US-007",
          "title": "Post a new project",
          "as_a": "Founder",
          "i_want": "to create a detailed project listing with description, budget, timeline, and required skills",
          "so_that": "qualified freelancers can apply to work on my project",
          "acceptance_criteria": [
            "Project form: title, description, scope, budget range, timeline, required skills",
            "Budget options: fixed price or hourly with estimated hours",
            "Milestone support: divide project into milestones with deliverables and payment amounts",
            "Attachments: upload brief, wireframes, or existing code",
            "Draft save before publishing"
          ]
        },
        {
          "id": "US-008",
          "title": "Project listing review and approval",
          "as_a": "Founder",
          "i_want": "to review my project listing before it goes live",
          "so_that": "I can ensure accuracy before freelancers see it",
          "acceptance_criteria": [
            "Preview page shows how the listing appears in search results",
            "Auto-approval for verified founders, manual review for new accounts",
            "Estimated time to go live shown (typically 1 hour)"
          ]
        },
        {
          "id": "US-009",
          "title": "Founder dashboard",
          "as_a": "Founder",
          "i_want": "to see all my active and past projects in one place",
          "so_that": "I can track progress and manage my hiring activity",
          "acceptance_criteria": [
            "Dashboard shows: active projects, pending applications, draft listings",
            "Each project card shows: title, status, applications count, next milestone",
            "Quick actions: view applications, message freelancer, release payment"
          ]
        }
      ]
    },
    {
      "epic": "Search & Discovery",
      "stories": [
        {
          "id": "US-010",
          "title": "Freelancer search",
          "as_a": "Founder",
          "i_want": "to search for freelancers by skill, rate, availability, and rating",
          "so_that": "I can find the best match for my project",
          "acceptance_criteria": [
            "Full-text search across name, bio, skills, and portfolio",
            "Filters: skill tags, hourly rate range, availability, rating minimum, location",
            "Sort by: relevance, rating, price low-high, price high-low, most projects completed",
            "Results show profile card with photo, name, skills, rate, rating, and badges",
            "Pagination and debounced search (300ms delay)"
          ]
        },
        {
          "id": "US-011",
          "title": "Project search",
          "as_a": "Freelance developer",
          "i_want": "to browse and search projects by skills, budget, and timeline",
          "so_that": "I can find projects that match my expertise and availability",
          "acceptance_criteria": [
            "Search across project title, description, and required skills",
            "Filters: budget range, timeline, project type (fixed/hourly), skills",
            "Sort by: newest, budget high-low, closest deadline",
            "Project card shows: title, budget, timeline, required skills, applicant count"
          ]
        },
        {
          "id": "US-012",
          "title": "Recommended matches",
          "as_a": "Freelance developer",
          "i_want": "to receive recommended projects based on my skills and history",
          "so_that": "I can find relevant opportunities without manual searching",
          "acceptance_criteria": [
            "Recommendations based on skill match score, past project categories, and rating",
            "Top 5 recommendations shown on dashboard",
            "AI-powered matching considers skill adjacency (React dev shown Next.js projects)"
          ]
        }
      ]
    },
    {
      "epic": "Applications & Hiring",
      "stories": [
        {
          "id": "US-013",
          "title": "Apply to a project",
          "as_a": "Freelance developer",
          "i_want": "to submit a proposal with my rate, availability, and a cover letter",
          "so_that": "the founder can evaluate and hire me",
          "acceptance_criteria": [
            "Proposal includes: proposed rate, estimated timeline, cover letter, relevant portfolio items",
            "Founder receives email notification of new application",
            "Freelancer can withdraw application before it is reviewed"
          ]
        },
        {
          "id": "US-014",
          "title": "Review and shortlist applicants",
          "as_a": "Founder",
          "i_want": "to view all applications, compare freelancers, and shortlist top candidates",
          "so_that": "I can make an informed hiring decision",
          "acceptance_criteria": [
            "Applications list shows: freelancer name, rate, proposal summary, rating, completed projects",
            "Side-by-side comparison of up to 3 freelancers",
            "Shortlist and reject actions with optional feedback"
          ]
        },
        {
          "id": "US-015",
          "title": "Hire a freelancer",
          "as_a": "Founder",
          "i_want": "to send a hiring offer with agreed terms",
          "so_that": "we can formalize the engagement and begin work",
          "acceptance_criteria": [
            "Offer form: agreed rate, start date, milestone plan",
            "Freelancer can accept, counter, or decline the offer",
            "Contract auto-generated upon acceptance",
            "Escrow account created with initial milestone funds"
          ]
        },
        {
          "id": "US-016",
          "title": "Freelancer acceptance of offer",
          "as_a": "Freelance developer",
          "i_want": "to review and accept or negotiate a hiring offer",
          "so_that": "I can start working on terms that work for me",
          "acceptance_criteria": [
            "Offer summary shows: rate, milestones, deliverables, timeline",
            "Accept: contract is signed and project moves to 'In Progress'",
            "Counter: freelancer can propose changes to rate or timeline",
            "Decline: freelancer is removed from applicant list",
            "24-hour expiration on offers"
          ]
        }
      ]
    },
    {
      "epic": "Project Workspace & Collaboration",
      "stories": [
        {
          "id": "US-017",
          "title": "Project workspace",
          "as_a": "Freelance developer",
          "i_want": "to have a shared workspace with task tracking, file sharing, and messaging",
          "so_that": "I can collaborate efficiently with the founder",
          "acceptance_criteria": [
            "Task board: columns for To Do, In Progress, Review, Done",
            "File sharing: upload and organize project files with version history",
            "Messaging: real-time chat with message history and file attachments",
            "Activity feed: shows all recent changes, messages, and milestone completions"
          ]
        },
        {
          "id": "US-018",
          "title": "Milestone tracking",
          "as_a": "Founder",
          "i_want": "to track milestone progress and approve completed deliverables",
          "so_that": "I can release payments only when work meets my expectations",
          "acceptance_criteria": [
            "Milestone list with status: Pending, In Progress, Submitted for Review, Approved, Paid",
            "Founder can request changes on submitted deliverables",
            "Funds released from escrow upon milestone approval",
            "Automatic reminder if milestone is past due"
          ]
        },
        {
          "id": "US-019",
          "title": "In-platform messaging",
          "as_a": "User (both roles)",
          "i_want": "to send direct messages and receive notifications",
          "so_that": "I can communicate without sharing personal contact details",
          "acceptance_criteria": [
            "Real-time messaging powered by WebSockets",
            "Message read receipts and typing indicators",
            "Notifications: email and in-app for new messages, milestones, and payments",
            "Notification preferences: frequency control and mute options"
          ]
        }
      ]
    },
    {
      "epic": "Payments & Escrow",
      "stories": [
        {
          "id": "US-020",
          "title": "Escrow payment deposit",
          "as_a": "Founder",
          "i_want": "to deposit project funds into an escrow account",
          "so_that": "the freelancer knows payment is secured before starting work",
          "acceptance_criteria": [
            "Deposit via credit card, bank transfer, or Stripe",
            "Funds held in escrow until milestones are approved",
            "Transaction fee shown before confirmation",
            "Receipt emailed after successful deposit"
          ]
        },
        {
          "id": "US-021",
          "title": "Milestone payment release",
          "as_a": "Founder",
          "i_want": "to approve and release payment for completed milestones",
          "so_that": "the freelancer gets paid for completed work",
          "acceptance_criteria": [
            "Release flow: review deliverable → approve → funds transferred from escrow",
            "Funds arrive in freelancer's account within 2-5 business days",
            "Platform fee deducted from payment (configurable percentage)"
          ]
        },
        {
          "id": "US-022",
          "title": "Dispute resolution",
          "as_a": "User (both roles)",
          "i_want": "to open a dispute if there is a disagreement about deliverables or payment",
          "so_that": "the platform can mediate and reach a fair resolution",
          "acceptance_criteria": [
            "Dispute can be opened within 14 days of milestone submission",
            "Both parties can submit evidence (messages, files, screenshots)",
            "Mediation timeline: 7 days for resolution",
            "Resolution options: full payment, partial payment, refund, or milestone revision"
          ]
        }
      ]
    },
    {
      "epic": "Reviews & Reputation",
      "stories": [
        {
          "id": "US-023",
          "title": "Rate a freelancer",
          "as_a": "Founder",
          "i_want": "to leave a rating and written review after project completion",
          "so_that": "other founders can benefit from my experience",
          "acceptance_criteria": [
            "Star rating 1-5 with required written review",
            "Categories: quality, communication, timeliness, budget adherence",
            "Review visible on freelancer profile after both parties review or 14 days pass"
          ]
        },
        {
          "id": "US-024",
          "title": "Rate a founder",
          "as_a": "Freelance developer",
          "i_want": "to rate my experience working with a founder",
          "so_that": "other freelancers can assess founder reliability",
          "acceptance_criteria": [
            "Star rating 1-5 with categories: communication, payment promptness, clarity of requirements",
            "Mutual review system: review hidden until both parties submit",
            "Founder rating displayed on project listings"
          ]
        },
        {
          "id": "US-025",
          "title": "Top-rated freelancer badge",
          "as_a": "Freelance developer",
          "i_want": "to earn a Top Rated badge after completing 10+ projects with 4.5+ average rating",
          "so_that": "I can attract higher-quality projects and command premium rates",
          "acceptance_criteria": [
            "Automatic badge awarded on meeting thresholds",
            "Top Rated freelancers shown first in search",
            "Badge visible on profile card and in search results",
            "Quarterly reassessment — badge can be lost if rating drops below 4.0"
          ]
        }
      ]
    },
    {
      "epic": "Admin & Moderation",
      "stories": [
        {
          "id": "US-026",
          "title": "Flag inappropriate content",
          "as_a": "User (both roles)",
          "i_want": "to flag projects, profiles, or messages that violate platform rules",
          "so_that": "the moderation team can review and take action",
          "acceptance_criteria": [
            "Flag button on all public content (projects, profiles, messages)",
            "Flag categories: spam, inappropriate, fraud, intellectual property violation",
            "Moderation dashboard for admin review"
          ]
        },
        {
          "id": "US-027",
          "title": "Admin user management",
          "as_a": "Platform admin",
          "i_want": "to view, suspend, or ban users and review dispute cases",
          "so_that": "I can maintain platform integrity and enforce terms of service",
          "acceptance_criteria": [
            "User list with search, filters (role, status, verification level)",
            "User detail view: profile, project history, payment history, flags, reviews",
            "Suspend: user cannot login, projects paused, pending payments held",
            "Ban: permanent removal with 30-day fund withdrawal window",
            "Audit log of all admin actions"
          ]
        }
      ]
    },
    {
      "epic": "Notifications & Communications",
      "stories": [
        {
          "id": "US-028",
          "title": "Email notifications",
          "as_a": "User (both roles)",
          "i_want": "to receive email notifications for key events",
          "so_that": "I stay informed without constantly checking the platform",
          "acceptance_criteria": [
            "Events: new application, offer received, message, milestone submission, payment released",
            "Customizable notification preferences per event type",
            "Daily digest option for non-urgent notifications",
            "Unsubscribe link in every email"
          ]
        },
        {
          "id": "US-029",
          "title": "In-app notification center",
          "as_a": "User (both roles)",
          "i_want": "to see all my notifications in one place within the app",
          "so_that": "I can review past notifications and never miss important updates",
          "acceptance_criteria": [
            "Notification bell icon with unread count badge",
            "Notification list with read/unread state, timestamp, and category",
            "Clicking notification navigates to relevant context",
            "Mark all as read and individual dismiss"
          ]
        }
      ]
    },
    {
      "epic": "Mobile & Cross-Platform",
      "stories": [
        {
          "id": "US-030",
          "title": "Responsive web design",
          "as_a": "User (both roles)",
          "i_want": "to use the platform on my mobile browser with full functionality",
          "so_that": "I can manage projects on the go",
          "acceptance_criteria": [
            "All core flows work on mobile browsers (profile, search, messaging, payments)",
            "Touch-friendly UI with appropriate tap targets (minimum 44px)",
            "Mobile navigation with bottom tab bar",
            "Offline support for reading cached messages and project data"
          ]
        },
        {
          "id": "US-031",
          "title": "Push notifications",
          "as_a": "User (both roles)",
          "i_want": "to receive push notifications on my mobile device",
          "so_that": "I get alerted to important events even when the browser tab is closed",
          "acceptance_criteria": [
            "Web push notifications via Service Worker",
            "Permission request on first relevant action",
            "Notification preferences synced across devices"
          ]
        }
      ]
    },
    {
      "epic": "Security & Compliance",
      "stories": [
        {
          "id": "US-032",
          "title": "Two-factor authentication",
          "as_a": "User (both roles)",
          "i_want": "to enable two-factor authentication on my account",
          "so_that": "my account is protected even if my password is compromised",
          "acceptance_criteria": [
            "TOTP-based 2FA via authenticator app (Google Authenticator, Authy)",
            "Backup codes provided during setup",
            "2FA can be disabled only after verifying current password and 2FA code"
          ]
        },
        {
          "id": "US-033",
          "title": "Data export",
          "as_a": "User (both roles)",
          "i_want": "to export all my data (profile, messages, transaction history)",
          "so_that": "I have a copy of my information as required by GDPR",
          "acceptance_criteria": [
            "Export request generates a downloadable ZIP within 24 hours",
            "Data includes: profile, messages, transactions, reviews, project history",
            "Export available in JSON and CSV formats",
            "Request and download tracked in audit log"
          ]
        },
        {
          "id": "US-034",
          "title": "Account deletion",
          "as_a": "User (both roles)",
          "i_want": "to permanently delete my account and all associated data",
          "so_that": "I can remove my presence from the platform",
          "acceptance_criteria": [
            "Account deletion request with 7-day grace period for reversal",
            "Pending payments and projects must be resolved before deletion",
            "Data permanently removed within 30 days",
            "Confirmation email sent before final deletion"
          ]
        }
      ]
    },
    {
      "epic": "AI-Powered Features",
      "stories": [
        {
          "id": "US-035",
          "title": "AI skill matching",
          "as_a": "Founder",
          "i_want": "to see AI-recommended freelancers ranked by compatibility score",
          "so_that": "I can quickly find the best candidates without manually reviewing every application",
          "acceptance_criteria": [
            "Compatibility score calculated from: skill match, past project similarity, rating, response time",
            "Top 3 AI recommendations shown at the top of the applicant list",
            "Score breakdown displayed (skill match: 92%, experience: 85%, etc.)",
            "Recommendations improve over time based on hiring outcomes"
          ]
        },
        {
          "id": "US-036",
          "title": "AI project scope suggestion",
          "as_a": "Founder",
          "i_want": "AI to suggest milestone breakdowns and timelines based on my project description",
          "so_that": "I can create realistic project scopes even if I am not technical",
          "acceptance_criteria": [
            "AI analyzes project description and suggests 3-5 milestones",
            "Each milestone includes: estimated effort, suggested timeline, deliverables",
            "Founder can accept, edit, or regenerate suggestions",
            "Suggestions based on similar completed projects on the platform"
          ]
        },
        {
          "id": "US-037",
          "title": "AI fraud detection",
          "as_a": "Platform admin",
          "i_want": "the system to automatically detect suspicious activity patterns",
          "so_that": "fraudulent accounts and scams are flagged before they harm users",
          "acceptance_criteria": [
            "Detection rules: rapid-fire account creation, copy-paste profiles, payment anomalies",
            "Flagged accounts sent to manual review queue",
            "False positive rate below 1%"
          ]
        }
      ]
    },
    {
      "epic": "Reports & Analytics",
      "stories": [
        {
          "id": "US-038",
          "title": "Platform analytics dashboard",
          "as_a": "Platform admin",
          "i_want": "to view platform-wide metrics (users, projects, revenue, disputes)",
          "so_that": "I can monitor growth and identify issues proactively",
          "acceptance_criteria": [
            "Dashboard widgets: new users (daily/weekly/monthly), active projects, total revenue, dispute rate",
            "Time-series charts with date range picker",
            "Export to CSV/PDF",
            "Automated weekly email report"
          ]
        },
        {
          "id": "US-039",
          "title": "Freelancer earnings report",
          "as_a": "Freelance developer",
          "i_want": "to generate a PDF earnings report for tax purposes",
          "so_that": "I can easily file my taxes",
          "acceptance_criteria": [
            "Report includes: total earnings by year, per-project breakdown, platform fees",
            "Available in PDF format",
            "Covers all historical data since account creation",
            "Downloadable from earnings dashboard"
          ]
        }
      ]
    },
    {
      "epic": "Platform Settings & Customization",
      "stories": [
        {
          "id": "US-040",
          "title": "Custom notification rules",
          "as_a": "User (both roles)",
          "i_want": "to create custom notification rules (e.g., only notify me for projects over $5,000)",
          "so_that": "I only receive alerts that matter to me",
          "acceptance_criteria": [
            "Rule conditions: budget threshold, skill match score, project type, founder rating",
            "Actions: email, push, or silent",
            "Multiple active rules allowed",
            "Rule testing: preview how many notifications would have been sent"
          ]
        },
        {
          "id": "US-041",
          "title": "Language and currency preferences",
          "as_a": "User (both roles)",
          "i_want": "to set my preferred language and currency in account settings",
          "so_that": "the platform displays content in my preferred format",
          "acceptance_criteria": [
            "Supported languages: English, Spanish, French, German, Portuguese",
            "Supported currencies: USD, EUR, GBP, BRL, INR",
            "All prices and earnings displayed in preferred currency",
            "Content translated using i18n framework"
          ]
        }
      ]
    },
    {
      "epic": "Onboarding & Tutorials",
      "stories": [
        {
          "id": "US-042",
          "title": "Freelancer onboarding wizard",
          "as_a": "New freelance developer",
          "i_want": "to complete a step-by-step onboarding wizard",
          "so_that": "I can set up my profile, verify my identity, and apply to my first project quickly",
          "acceptance_criteria": [
            "Step 1: Basic info (name, photo, location)",
            "Step 2: Skills and experience",
            "Step 3: Portfolio upload",
            "Step 4: Identity verification",
            "Step 5: Browse recommended projects",
            "Progress saved across sessions"
          ]
        },
        {
          "id": "US-043",
          "title": "Founder onboarding wizard",
          "as_a": "New founder",
          "i_want": "to complete a guided setup for posting my first project",
          "so_that": "I can get started even if I have never hired freelancers before",
          "acceptance_criteria": [
            "Step 1: Company profile",
            "Step 2: Project description with AI-assisted scope suggestions",
            "Step 3: Budget and milestone setup",
            "Step 4: Review and publish",
            "Tooltips and help links at every step"
          ]
        }
      ]
    },
    {
      "epic": "API & Integrations",
      "stories": [
        {
          "id": "US-044",
          "title": "Public API for project listings",
          "as_a": "External developer",
          "i_want": "to access project listings via a REST API",
          "so_that": "I can build third-party tools and integrations",
          "acceptance_criteria": [
            "RESTful API with API key authentication",
            "Endpoints: list projects, get project details, search freelancers",
            "Rate limiting: 1000 requests/hour per key",
            "API documentation with OpenAPI/Swagger spec"
          ]
        },
        {
          "id": "US-045",
          "title": "Slack integration",
          "as_a": "Founder",
          "i_want": "to receive project notifications in a Slack channel",
          "so_that": "my team stays updated without checking the platform",
          "acceptance_criteria": [
            "OAuth-based Slack integration",
            "Configurable event types: new application, message, milestone update, payment",
            "Channel selection during setup"
          ]
        },
        {
          "id": "US-046",
          "title": "Calendar sync",
          "as_a": "Freelance developer",
          "i_want": "to sync project milestones and deadlines to my Google Calendar",
          "so_that": "I never miss a deadline",
          "acceptance_criteria": [
            "Google Calendar OAuth integration",
            "Milestones and deadlines synced as calendar events",
            "Two-way sync: changes in either platform reflected in both",
            "Configurable sync frequency"
          ]
        }
      ]
    },
    {
      "epic": "Gamification & Engagement",
      "stories": [
        {
          "id": "US-047",
          "title": "Freelancer achievement badges",
          "as_a": "Freelance developer",
          "i_want": "to earn achievement badges for completing milestones like first project, 10 projects, $10k earned",
          "so_that": "I feel recognized and motivated to stay active on the platform",
          "acceptance_criteria": [
            "Achievement badges: First Project, Rising Star (5 projects), Top Rated (10 projects), Thousand Club ($10k earned)",
            "Badges displayed on profile",
            "Notification when new badge is earned",
            "Rarity indicator shown (e.g., 5% of freelancers have this badge)"
          ]
        }
      ]
    }
  ]
}
```

**Terminal output:**
```
  • User Stories: 47
  • Acceptance Criteria: 142
  • Milestones: 6
  • Roadmap Phases: 4
✔ Phase 2/10: plan completed
```

---

### Phase 3/10: Discover Skills

**Skill:** Skill Discovery Engine

**What it does:**
- Analyzes the Plan artifacts to determine which engineering skills are needed
- Builds a dependency DAG (Directed Acyclic Graph)
- Groups independent skills for parallel execution
- Estimates duration

**Output:**
```
  • Skills Discovered: 12
    - UX Designer, UI Designer, Frontend Engineer, Backend Engineer,
      Database Engineer, AI Engineer, Security Engineer, Cloud Engineer,
      DevOps Engineer, QA Engineer, Documentation Engineer, Mobile Engineer
  • Parallel Groups: 4
    Group 1: UX Designer, Security Engineer
    Group 2: UI Designer, Database Engineer
    Group 3: Frontend Engineer, Backend Engineer, AI Engineer
    Group 4: Cloud Engineer, DevOps Engineer, QA Engineer
  • Estimated Duration: 45m
✔ Phase 3/10: discover-skills completed
```

**DAG structure (simplified):**
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

---

### Phase 4/10: Build

**Skills:** 12 skills in 4 parallel groups (DAG-resolved)

**What each group produces:**

| Group | Skills | Key Artifacts |
|-------|--------|---------------|
| 1 | UX Designer | Wireframes, user flow diagrams, interaction specs |
| 1 | Security Engineer | Threat model, auth flow, encryption strategy |
| 2 | UI Designer | High-fidelity mockups, design system, component library |
| 2 | Database Engineer | Schema, migrations, indexes, query plans |
| 3 | Frontend Engineer | React app, components, routes, state management |
| 3 | Backend Engineer | API endpoints, middleware, business logic |
| 3 | AI Engineer | Matching algorithm, recommendation engine |
| 4 | Cloud Engineer | AWS/GCP infra as code, networking, scaling |
| 4 | DevOps Engineer | CI/CD pipelines, Docker, monitoring setup |
| 4 | QA Engineer | Test plans, E2E tests, load test scripts |

**Terminal output:**
```
  • Artifacts Created: 156
  • Skills Executed: 12
✔ Phase 4/10: build completed
```

---

### Phase 5/10: Review

**Skill:** Code Reviewer

**What it does:**
- Reads all 156 build artifacts
- Scores across: correctness, architecture, security, performance, scalability, maintainability
- Tags findings with severity: Blocker, High, Medium, Low, Info
- Marks auto-fixable items

**Output:**
```
  • Findings: 23
  • Blockers: 2
    - API endpoint /api/escrow/pay lacks input validation
    - Database migration V003 contains a non-indexed foreign key
  • High: 7
  • Medium: 9
  • Low: 5
  • Auto-fixable: 15
✔ Phase 5/10: review completed
```

---

### Phase 6/10: Fix

**Skill:** Code Fixer

**What it does:**
- Applies automated fixes to all 15 auto-fixable findings
- Runs regression check after each fix
- Escalates non-fixable items (2 blockers that require human judgment)

**Output:**
```
  • Fixed: 15
  • Failed: 0
  • Escalated: 2
    - API endpoint /api/escrow/pay lacks input validation (BLOCKER)
    - Database migration V003 contains a non-indexed foreign key (BLOCKER)
✔ Phase 6/10: fix completed
```

---

### Phase 7/10: Validate

**Skill:** Validation Engine

**What it does:**
- Runs 6 validation stages against the generated project:

| Stage | Check | Status |
|-------|-------|--------|
| Type Checking | TypeScript `tsc --noEmit` | ✅ Pass (0 errors) |
| Linting | ESLint on all source files | ✅ Pass (0 errors) |
| Security Scan | Snyk / npm audit on dependencies | ✅ Pass (0 critical) |
| Performance Test | Lighthouse / k6 load test | ✅ Pass (p95 < 200ms) |
| Accessibility | axe-core WCAG 2.1 AA scan | ✅ Pass (0 violations) |
| Contract Tests | API contract conformance | ✅ Pass (all endpoints) |

**Output:**
```
  • Stages: 6
  • Passed: 6
  • Failed: 0
✔ Phase 7/10: validate completed
```

---

### Phase 8/10: Human Approval

**Skill:** Principal Engineer Simulator

**What it does:**
- Compiles all findings, fixes, and validation results into a PR-style review summary
- In manual mode (default): presents the summary and waits for approve/reject/feedback
- In auto mode (`--no-human-approval`): approves automatically

**Output (auto mode):**
```
  • Decision: APPROVED
  • Reviewer: auto-approved
  • Summary:
    ┌─────────────────────────────────────────────────────┐
    │  Phase 1: Understand       ✅ 5 artifacts           │
    │  Phase 2: Plan            ✅ 47 user stories        │
    │  Phase 3: Discover        ✅ 12 skills, 4 groups    │
    │  Phase 4: Build           ✅ 156 artifacts          │
    │  Phase 5: Review          ✅ 23 findings            │
    │  Phase 6: Fix             ✅ 15/15 auto-fixed       │
    │  Phase 7: Validate        ✅ 6/6 stages passed      │
    └─────────────────────────────────────────────────────┘
✔ Phase 8/10: human-approval completed
```

---

### Phase 9/10: Optimize

**Skill:** Optimization Engine (3 iterations)

**What it does:**
- Iteratively improves across 5 dimensions:

| Dimension | Improvement |
|-----------|-------------|
| Performance | Bundle splitting, lazy loading, CDN caching |
| Security | CSP headers, rate limiting, SQL injection hardening |
| Scalability | Auto-scaling groups, read replicas, connection pooling |
| Cost | Reserved instances, spot instances, cache sizing |
| DX | Error messages, logging, developer documentation |

**Output:**
```
  • Iteration 1: +8.2% improvement (low-hanging fruit)
  • Iteration 2: +9.5% improvement (structural changes)
  • Iteration 3: +5.3% improvement (fine-tuning)
  • Total Improvement: 23.0%
✔ Phase 9/10: optimize completed
```

---

### Phase 10/10: Deliver

**Skill:** Delivery Engineer

**What it does:**
- Assembles all 156+ artifacts into a structured delivery package

**Delivery package structure:**
```
delivery/
├── README.md                          # Project documentation
├── docs/
│   ├── architecture.md                # System architecture
│   ├── api-reference.md               # API documentation
│   ├── deployment-guide.md            # Deployment instructions
│   ├── monitoring.md                  # Monitoring setup
│   └── runbook.md                     # Operations runbook
├── src/
│   ├── frontend/                      # React application
│   ├── backend/                       # Node.js API
│   ├── mobile/                        # React Native app
│   └── ai/                            # ML matching engine
├── tests/
│   ├── unit/                          # 340 unit tests
│   ├── integration/                   # 85 integration tests
│   └── e2e/                           # 22 E2E tests
├── infra/
│   ├── terraform/                     # Infrastructure as code
│   ├── docker/                        # Docker Compose
│   └── kubernetes/                    # K8s manifests
├── monitoring/
│   ├── grafana/                       # Dashboards
│   └── prometheus/                    # Alert rules
├── scripts/
│   ├── setup.sh
│   ├── deploy.sh
│   └── rollback.sh
└── .github/
    └── workflows/
        └── ci.yml                     # CI pipeline
```

**Output:**
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

### Step 3: Inspect the Delivery

```bash
ls -la ./output/proj-a1b2c3d4/delivery/
tree ./output/proj-a1b2c3d4/delivery/
```

---

### Step 4: Resume if Interrupted

If the process stops mid-way (Ctrl+C, crash), resume from the last completed phase:

```bash
ai-se resume --project ./output/proj-a1b2c3d4 --no-human-approval
```

State is persisted to disk after each phase — no data loss.

---

## [10-Phase Workflow](docs/workflow-phases.md)

| # | Phase | Skills | Key Outputs |
|---|-------|--------|-------------|
| 1 | **Understand** | Business Analyst, Product Strategist | Vision, goals, requirements, risks |
| 2 | **Plan** | Product Manager, Solution Architect, Technical Writer | PRD, user stories, tech spec, roadmap |
| 3 | **Discover Skills** | Skill Discovery Engine | Skill dependency DAG with parallel groups |
| 4 | **Build** | All project skills (parallel groups) | Architecture, code, UI, API, DB, infra |
| 5 | **Review** | Code Reviewer | Findings with severity breakdown |
| 6 | **Fix** | Code Fixer | Remediated artifacts, regression check |
| 7 | **Validate** | Validation Engine | Static analysis, lint, type-check, test results |
| 8 | **Human Approval** | Principal Engineer Simulator | Approval or feedback (auto or manual) |
| 9 | **Optimize** | Optimization Engine | Performance, security, cost, UX improvements |
| 10 | **Deliver** | Delivery Engineer | Complete package with docs, deploy guide, runbooks |

Each phase is explained in detail with example output at [docs/workflow-phases.md](docs/workflow-phases.md).

---

## Built-in Skills (24)

`product-strategist` · `business-analyst` · `product-manager` · `solution-architect` · `technical-writer` · `ux-designer` · `ui-designer` · `frontend-engineer` · `backend-engineer` · `mobile-engineer` · `ai-engineer` · `database-engineer` · `cloud-engineer` · `devops-engineer` · `security-engineer` · `qa-engineer` · `documentation-engineer` · `code-reviewer` · `code-fixer` · `validation-engine` · `optimization-engine` · `delivery-engineer` · `principal-engineer-simulator` · `skill-discovery-engine`

---

## [Connect AI Providers](docs/skill-executors.md)

Skills plug into any LLM provider via a simple executor interface:

| Provider | Setup |
|----------|-------|
| [Anthropic Claude](docs/skill-executors.md#1-anthropic-claude-recommended) | `npm install @anthropic-ai/sdk` + `ANTHROPIC_API_KEY` |
| [OpenAI GPT-4](docs/skill-executors.md#2-openai--gpt-4) | `npm install openai` + `OPENAI_API_KEY` |
| [Ollama (Local)](docs/skill-executors.md#3-ollama-local-free) | No SDK needed — uses `fetch` |
| [Google Gemini](docs/skill-executors.md#4-google-gemini) | `npm install @google/generative-ai` + `GEMINI_API_KEY` |

Full code examples for each provider at [docs/skill-executors.md](docs/skill-executors.md).

---

## [CLI Reference](docs/cli-reference.md)

| Command | Description |
|---------|-------------|
| `init [idea]` | Initialize a new project |
| `run --project <id>` | Execute the workflow |
| `status --project <id>` | Show project state |
| `resume --project <id>` | Resume interrupted workflow |
| `stop --project <id>` | Stop running project |
| `validate --project <id>` | Run validation pipeline |
| `doctor` | Check system health |
| `skills list/show <id>` | Manage skill definitions |
| `templates list/show <name>` | Manage templates |
| `config show/set <key> <value>` | Manage project config |

Full details with examples at [docs/cli-reference.md](docs/cli-reference.md).

---

## [Configuration](docs/configuration.md)

Configure via `project-config.json` or CLI:

| Option | Default | Description |
|--------|---------|-------------|
| `model` | `claude-3-5-sonnet` | Default AI model |
| `maxParallelSkills` | `4` | Max concurrent skill executions |
| `validationLevel` | `standard` | `strict`, `standard`, or `minimal` |
| `humanApprovalRequired` | `true` | Require human approval gate |

---

## [Custom Skills](docs/custom-skills.md)

Create your own skills with a YAML definition file and optional executor:

```yaml
id: my-skill
name: My Skill
version: "1.0.0"
mission: "One-sentence mission statement"
model: claude-3-5-sonnet
responsibilities:
  - "Do X"
  - "Do Y"
inputs:
  - artifact_id: "input-name"
    contract: "json"
    required: true
outputs:
  - artifact_id: "output-name"
    contract: "markdown"
dependencies: ["dependency-skill-id"]
```

Full guide at [docs/custom-skills.md](docs/custom-skills.md).

---

## Development

```bash
npm run typecheck    # TypeScript strict mode
npm run lint         # ESLint
npm test             # Jest (unit + integration + E2E)
npm run build        # Compile to dist/
npm run dev -- init "My idea"   # Run in dev mode
```

**Stack:** TypeScript, Commander.js, Inquirer.js, Ora, Chalk, fs-extra, Handlebars, Zod, Jest, EventEmitter3.

---

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) and [ROADMAP.md](ROADMAP.md).

High-impact areas:
- **Custom executors** — Wire up real LLM providers (OpenAI, Anthropic, Ollama, Gemini, etc.)
- **New skill definitions** — Add YAML for additional engineering roles
- **Validation stages** — Extend the pipeline with new checks
- **Storage backends** — Add S3, DynamoDB, PostgreSQL adapters
- **UI dashboard** — Web interface for workflow visibility

---

## Show Your Support

<div align="center">

[![Star](https://img.shields.io/github/stars/forgephantom/Ai-skill-engineer?style=for-the-badge&logo=github&label=%E2%98%85%20Star%20this%20repo)](https://github.com/forgephantom/Ai-skill-engineer/stargazers)
[![Fork](https://img.shields.io/github/forks/forgephantom/Ai-skill-engineer?style=for-the-badge&logo=github&label=Fork)](https://github.com/forgephantom/Ai-skill-engineer/forks)
[![Follow](https://img.shields.io/github/followers/forgephantom?style=for-the-badge&logo=github&label=Follow)](https://github.com/forgephantom)

</div>

[![Star History Chart](https://api.star-history.com/svg?repos=forgephantom/Ai-skill-engineer&type=Date)](https://star-history.com/#forgephantom/Ai-skill-engineer&Date)

---

## License

[MIT](LICENSE) — Copyright (c) 2026 forgephantom. See [LICENSE](LICENSE) for full text.

---

## Legal Disclaimer

**AI Skill Engineer** is a development tool that generates code and project artifacts using AI models. By using this software:

1. **AI-generated code** — The output produced by this tool is generated by large language models and may contain errors, security vulnerabilities, or non-compliant code. You are responsible for reviewing, testing, and validating all generated output before deploying it to any production environment.

2. **No warranty** — The software is provided "AS IS", without warranty of any kind. The generated output is not guaranteed to be correct, secure, performant, or free of defects.

3. **`--no-human-approval`** — This flag bypasses the human review gate. Use it only for development/testing. For production use, always review generated code manually and ensure proper security and compliance checks.

4. **Third-party dependencies** — The generated project may include suggestions for third-party packages, libraries, or services. You are responsible for reviewing their licenses and terms of service.

5. **API keys** — You are responsible for all API usage and costs associated with your own API keys. The maintainer does not provide or manage API keys.

6. **Compliance** — You are solely responsible for ensuring that any project generated with this tool complies with all applicable laws, regulations, and industry standards.
