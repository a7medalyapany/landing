#!/bin/bash
# PostToolUse(Write|Edit) on src/ or tests/ *.ts/*.tsx: fast feedback. Non-blocking,
# but feeds type errors back to Claude (additionalContext) so it self-corrects.
command -v jq >/dev/null 2>&1 || exit 0
TARGET=$(jq -r '.tool_input.file_path // .tool_input.path // empty')
case "$TARGET" in
  */src/*.ts|*/src/*.tsx|*/tests/*.ts|*/tests/*.tsx)
    cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
    OUT=$(pnpm -s typecheck 2>&1 | tail -20)
    if [ -n "$OUT" ]; then
      jq -n --arg o "$OUT" '{hookSpecificOutput:{hookEventName:"PostToolUse",additionalContext:("typecheck output after this edit:\n" + $o)}}'
    fi
    ;;
esac
exit 0
