#!/bin/bash
# PreToolUse(Write|Edit): block edits to Payload-generated files and secrets.
# Allowed on purpose: .env.example (documents vars) and (payload)/custom.scss (admin styles).
# Denies via JSON on stdout + exit 0 (with exit 2 Claude Code ignores stdout JSON).
if ! command -v jq >/dev/null 2>&1; then
  echo "block-protected-writes: jq not installed, protection skipped" >&2
  exit 0
fi
TARGET=$(jq -r '.tool_input.file_path // .tool_input.path // empty')
case "$TARGET" in
  *"/(payload)/custom.scss"|*"/.env.example") exit 0 ;;
  *"/payload-types.ts"|*"/(payload)/"*|*"/.env"|*"/.env.local"|*"/.env.production"|*"/.env."*".local")
    jq -n --arg t "$TARGET" '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:("Protected path (generated or secret), do not edit: " + $t + ". Regenerate with pnpm generate:types / generate:importmap instead.")}}'
    exit 0 ;;
esac
exit 0
