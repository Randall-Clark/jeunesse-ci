# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Jeunesse CI (artifacts/jeunesse-ci)
- React + Vite web app, preview path: `/`
- Platform for African youth in Côte d'Ivoire inspired by Canada Business
- Features: categories (entrepreneuriat, emploi, formation, santé, droits, logement), step-by-step guides, resources directory, news/opportunities
- Language: French

### API Server (artifacts/api-server)
- Express 5 backend, preview path: `/api`
- Routes: /categories, /guides, /guides/featured, /resources, /news, /news/featured, /stats/summary
- Seed data auto-runs on first start (idempotent)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## DB Schema

Tables: categories, guides, guide_steps, resources, news

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
