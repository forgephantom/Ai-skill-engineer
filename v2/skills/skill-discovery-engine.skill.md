# skill-discovery-engine
> Determine the expert roster and execution graph from project requirements.

## In
- prd (markdown) - product requirements [required]
- tech-spec (markdown) - tech spec [required]
- user-stories (json) - user stories [required]
- architecture-decisions (markdown) - architecture decisions [required]
- non-functional-requirements (json) - NFRs [required]

## Do
1. Analyze requirements and target platforms (web, android, ios, mac, windows) to identify required skills.
2. Build the dependency DAG and execution order.
3. Identify truly independent parallel groups.
4. Estimate duration per skill and total.
5. Flag missing skills; list required templates.

## Out
- skill-graph (json) - skill graph with DAG
- skill-definitions (json) - selected skills
- parallel-groups (json) - parallel groups
- execution-order (json) - execution order
- estimated-duration (json) - duration estimates
- required-templates (json) - required templates
- skill-gaps (json) - missing skills

## Validate
- R-GRAPH-ACYCLIC: graph acyclic [BLOCKER]
- R-SKILL-COVERAGE: all required skills present [BLOCKER]
- R-NO-CROSS-DEP: no cross-dependencies in parallel groups [HIGH]
- R-ARTIFACT-PRODUCER: every artifact has a producer [BLOCKER]
- R-TOPO: execution order topologically valid [BLOCKER]
