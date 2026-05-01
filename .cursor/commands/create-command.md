---
name: create-command
description: Create or update Cursor slash commands using Skills.sh command structure. Use when the user asks to add, refine, or document a /command workflow.
argument-hint: [command name and purpose]
---

<objective>
Create a focused Cursor slash command from `$ARGUMENTS`.

Use a command when the user wants an explicit `/name` workflow. If the request is better as a rule, skill, subagent, or hook, route it there instead of forcing a command.
</objective>

<context>
Read `.cursor/README.md` and existing `.cursor/commands/*.md` files before editing.

Use the Skills.sh structure for command files:
- YAML frontmatter
- `<objective>`
- `<process>` or `<steps>`
- `<success_criteria>`
- Optional `<context>`, `<verification>`, `<testing>`, and `<output>`
</context>

<process>
1. Parse the requested command name, purpose, trigger, arguments, and output.
2. Ask only for missing essentials:
   - command name
   - whether it should create files or only guide the agent
   - required inputs or `$ARGUMENTS`
3. Confirm a slash command is the right artifact:
   - Use `/create-skill` for reusable domain workflow knowledge.
   - Use `/create-subagent` for complex isolated specialist work.
   - Use `/create-rule` for persistent guidance.
   - Use `/create-hook` for automatic behavior around events.
4. Create or update `.cursor/commands/<name>.md`.
5. Keep the command concise, concrete, and under 150 lines unless the user explicitly asks for more.
6. Update `.cursor/README.md` command inventory.
</process>

<success_criteria>
- The command has valid frontmatter and XML sections.
- `$ARGUMENTS` usage is clear when dynamic input is expected.
- The command routes to other artifact types when they are a better fit.
- Token usage stays low: avoid subagents for narrow command authoring, and do not set expensive models unless the user explicitly asks.
</success_criteria>
