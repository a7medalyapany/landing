#!/bin/bash
# PostToolUse(Write|Edit) on src/ or tests/ *.ts/*.tsx: fast feedback. Non-blocking,
# but feeds problems back to Claude (additionalContext) so it self-corrects:
#   - 'use client' on a route file (pages/layouts must stay Server Components)
#   - typecheck errors
command -v jq >/dev/null 2>&1 || exit 0
TARGET=$(jq -r '.tool_input.file_path // .tool_input.path // empty')
MSG=""

case "$TARGET" in
  */src/app/*/page.tsx|*/src/app/*/layout.tsx|*/src/app/*/template.tsx|*/src/app/*/not-found.tsx)
    case "$TARGET" in */\(payload\)/*) ;; *)
      if [ -f "$TARGET" ] && head -n 5 "$TARGET" | grep -qE "^[[:space:]]*['\"]use client['\"]"; then
        MSG="'use client' found in route file $TARGET. Pages and layouts must stay Server Components: move the interactive part into a small client component and render it from here (see the nextjs-frontend skill)."
      fi ;;
    esac ;;
esac

case "$TARGET" in
  */src/*.ts|*/src/*.tsx|*/tests/*.ts|*/tests/*.tsx)
    cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
    OUT=$(pnpm -s typecheck 2>&1 | tail -20)
    if [ -n "$OUT" ]; then
      MSG="${MSG:+$MSG

}typecheck output after this edit:
$OUT"
    fi
    ;;
esac

if [ -n "$MSG" ]; then
  jq -n --arg m "$MSG" '{hookSpecificOutput:{hookEventName:"PostToolUse",additionalContext:$m}}'
fi
exit 0
