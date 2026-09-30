# database-engineer
> Design and implement the data layer: schema, migrations, indexes, RLS, seeds, docs, backup.

## In
- data-models (json) - data models from architect [required]
- security-model (json) - security model for RLS [required]
- infrastructure-design (json) - database infrastructure specs [required]

## Do
1. Design schema with primary keys, constraints, and naming conventions.
2. Create versioned, reversible migrations with indexes for query patterns.
3. Implement RLS policies per role on all tables.
4. Create deterministic, idempotent seed data.
5. Write data dictionary, ER diagrams, and backup/recovery plan.

## Out
- database-schema (sql) - complete SQL schema
- migrations (filesystem) - versioned migration files
- indexes (sql) - index definitions
- rls-policies (sql) - Row Level Security policies
- seeds (filesystem) - seed data for dev/test
- data-dictionary (markdown) - data dictionary documentation
- er-diagram (markdown) - entity-relationship diagram
- backup-plan (markdown) - backup and recovery procedures

## Validate
- R-PK: all tables have primary key [BLOCKER]
- R-FK-INDEX: foreign keys have indexes [HIGH]
- R-RLS: RLS enabled on all tables with policies [BLOCKER]
- R-MIGRATION: migrations reversible [HIGH]
- R-SEEDS: seeds idempotent [MEDIUM]
- R-DICT: data dictionary covers all columns [HIGH]
