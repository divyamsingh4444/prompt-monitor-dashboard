# API Documentation Setup

This project uses Swagger UI for interactive API documentation.

## Files

- `docs/openapi.yaml` - OpenAPI specification (single source of truth)
- `app/api/openapi/route.ts` - API route that serves the spec
- `public/swagger.html` - Standalone Swagger UI HTML file

## Access

Visit `/swagger.html` to view the interactive API documentation.

## Updating the API Spec

Simply edit `docs/openapi.yaml` - it's automatically served via the API route at `/api/openapi`.
