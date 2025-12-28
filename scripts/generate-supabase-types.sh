#!/usr/bin/env bash

# Script to generate Supabase database types
# Uses Supabase CLI to generate TypeScript types from the database schema
#
# Note: Requires Supabase CLI authentication first:
#   npx supabase login

set -e

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Load environment variables from .env.local if it exists
if [ -f "$PROJECT_ROOT/.env.local" ]; then
  set -a
  source "$PROJECT_ROOT/.env.local"
  set +a
fi

# Check if SUPABASE_ACCESS_TOKEN is set (alternative to login)
if [ -n "$SUPABASE_ACCESS_TOKEN" ]; then
  export SUPABASE_ACCESS_TOKEN
fi

# Get project ID by extracting it from NEXT_PUBLIC_SUPABASE_URL
# The project ID is the subdomain part of the URL
# Example: https://abcdefghijklmnop.supabase.co -> abcdefghijklmnop
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "Error: NEXT_PUBLIC_SUPABASE_URL environment variable is required" >&2
  echo "" >&2
  echo "Please set in .env.local:" >&2
  echo "  NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co" >&2
  exit 1
fi

# Extract project ref from URL: https://xxxxx.supabase.co -> xxxxx
if [[ ! "$NEXT_PUBLIC_SUPABASE_URL" =~ https?://([^.]+)\.supabase\.(co|io) ]]; then
  echo "Error: Could not extract project ID from NEXT_PUBLIC_SUPABASE_URL" >&2
  echo "Received URL: $NEXT_PUBLIC_SUPABASE_URL" >&2
  echo "" >&2
  echo "Expected format: https://your-project-ref.supabase.co" >&2
  exit 1
fi

PROJECT_ID="${BASH_REMATCH[1]}"
echo "Extracted project ID from NEXT_PUBLIC_SUPABASE_URL: $PROJECT_ID"

OUTPUT_PATH="$PROJECT_ROOT/src/generated/types/SupabaseTypes.ts"

echo ""
echo "📝 Generating Supabase types for project: $PROJECT_ID"
echo "📁 Output: $OUTPUT_PATH"
echo ""

# Generate types using Supabase CLI
if npx supabase gen types typescript --project-id "$PROJECT_ID" > "$OUTPUT_PATH"; then
  echo "✅ Successfully generated Supabase types!"
else
  echo "❌ Error generating types" >&2
  echo "" >&2
  echo "💡 To fix this, choose one of these options:" >&2
  echo "" >&2
  echo "Option 1: Use Personal Access Token (Recommended)" >&2
  echo "  1. Go to https://supabase.com/dashboard/account/tokens" >&2
  echo "  2. Create a new Personal Access Token" >&2
  echo "  3. Add it to .env.local:" >&2
  echo "     SUPABASE_ACCESS_TOKEN=your_token_here" >&2
  echo "  4. Run this script again" >&2
  echo "" >&2
  echo "Option 2: Use CLI Login" >&2
  echo "  1. Run: npx supabase login" >&2
  echo "  2. Follow the authentication flow" >&2
  echo "  3. Run this script again" >&2
  echo "" >&2
  echo "Option 3: Use MCP Tool" >&2
  echo "  Use the Supabase MCP tool to generate types directly" >&2
  exit 1
fi

