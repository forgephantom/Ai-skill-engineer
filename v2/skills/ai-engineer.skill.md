# ai-engineer
> Build production AI/ML features: LLMs, RAG, agents, embeddings, guardrails, evaluation.

## In
- functional-requirements (json) - feature requirements [required]
- data-models (json) - data models [required]
- api-contracts (yaml) - endpoint contracts [required]

## Do
1. Design LLM app architecture and versioned prompt templates.
2. Build RAG pipelines: retrieval, reranking, generation, citations.
3. Build agents with tool use and state; set up embeddings and vector search.
4. Build evaluation pipelines and AI observability.
5. Add guardrails for PII, injection, hallucination; optimize latency and cost.

## Out
- llm-architecture (markdown) - app architecture
- rag-pipeline (filesystem) - RAG implementation
- agents (filesystem) - agent implementations
- prompts (filesystem) - prompt templates
- embeddings (filesystem) - embeddings and vector search
- evaluation (filesystem) - benchmarks and CI
- guardrails (filesystem) - safety implementation
- ai-monitoring (filesystem) - observability
- cost-optimization (markdown) - cost analysis

## Validate
- R-RAG-EVAL: RAG has evaluation benchmarks [BLOCKER]
- R-PROMPTS: prompts versioned and tested [HIGH]
- R-GUARDRAILS: guardrails cover PII, injection, hallucination [BLOCKER]
- R-EVAL-CI: evaluation runs in CI/CD [HIGH]
- R-COST-ALERT: cost monitoring with alerts [HIGH]
- R-LATENCY-BUDGET: latency budgets set and monitored [HIGH]
