# AI Agent Context Prompt

Before making any changes, read these docs in order:

1. **README.md** - Project overview, tech stack, structure
2. **docs/development.md** - Workflow, conventions, how to add APIs/components
3. **docs/type-system.md** - Type generation and import patterns
4. **docs/architecture.md** - System architecture and design
5. **docs/openapi.yaml** - API specification (source of truth)

## Critical Rules

- **Types**: Import from `@/types` only
- **API Client**: Import `apiClient` and `ApiError` from `@/lib/api-client`
- **Never**: Import directly from `src/generated/*` files
- **After schema/API changes**: Run `pnpm run generate:all`

## Quick Reference

- API Routes: `app/api/`
- Components: `components/`
- Types Hub: `types/index.ts`
- API Client: `lib/api-client.ts`
- Generated: `src/generated/` (DO NOT EDIT)
