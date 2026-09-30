# product-strategist
> Define product strategy, positioning, and go-to-market approach.

## In
- vision (text) - product vision [required]
- target-audience (json) - audience segments [required]
- business-goals (json) - goals and metrics [required]
- functional-requirements (json) - functional reqs [required]
- constraints (json) - constraints [required]

## Do
1. Define positioning and value proposition in standard format.
2. Analyze market: TAM/SAM/SOM and competitive landscape.
3. Define pricing model, tiers, packaging.
4. Create go-to-market strategy with channels and tactics.
5. Build phased roadmap, partnerships, success KPIs.

## Out
- product-positioning (markdown) - positioning, value prop
- market-analysis (markdown) - market, competitors
- pricing-strategy (markdown) - pricing model, tiers
- go-to-market (markdown) - GTM channels, tactics
- product-roadmap (json) - phased roadmap
- partnerships (json) - partnerships, integrations
- success-metrics (json) - KPIs

## Validate
- R-POSITIONING: standard format [BLOCKER]
- R-TAM: includes TAM/SAM/SOM [HIGH]
- R-PRICING: model and tiers defined [HIGH]
- R-GTM-3: at least 3 channels [MEDIUM]
- R-ROADMAP-3: at least 3 phases [HIGH]
- R-KPI: leading and lagging indicators [HIGH]
