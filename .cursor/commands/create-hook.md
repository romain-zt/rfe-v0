---
name: create-hook
description: Create Cursor hooks for agent events. Use when the user asks to automate, gate, audit, or follow up on tool, shell, MCP, prompt, or file events.
argument-hint: [hook behavior]
---

<objective>
Create or update a Cursor hook from `$ARGUMENTS` that runs around a specific agent or tab event.
</objective>

<context>
Use the `create-hook` skill instructions before writing files.

Default to project hooks in `.cursor/hooks.json` and `.cursor/hooks/*` when the behavior belongs to this repo. Use user hooks in `~/.cursor/` only for personal cross-project automation.
</context>

<process>
1. Gather only missing essentials: scope, trigger event, behavior, implementation type, matcher, and fail-open/fail-closed preference.
2. Choose the narrowest event that matches the goal.
3. Prefer deterministic command hooks for auditable behavior; use prompt hooks only for lightweight judgment calls.
4. Preserve unrelated existing hooks.
5. Create or update `hooks.json`, add scripts under the matching hooks directory, and make scripts executable.
6. Verify required helper binaries exist before finishing.
7. Update `.cursor/README.md` if project hook files are added.
</process>

<success_criteria>
- The hook uses the correct location and relative path style.
- The hook returns only fields supported by its event.
- Matchers are simple JavaScript regexes, or filtering happens inside the script.
- The hook is tested by triggering the real event when practical.
- Token usage stays low: no subagent unless debugging a complex hook failure.
</success_criteria>
