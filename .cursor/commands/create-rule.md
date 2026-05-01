---
name: create-rule
description: Create Cursor project rules in .cursor/rules. Use when the user asks to add persistent guidance, coding standards, or file-specific AI behavior.
argument-hint: [rule purpose]
---

<objective>
Create a concise Cursor rule from `$ARGUMENTS` that gives persistent project guidance.
</objective>

<context>
Use the `create-rule` skill instructions before writing files.

Project rules live in `.cursor/rules/*.mdc` and must include YAML frontmatter.
</context>

<process>
1. Gather only missing essentials: purpose, scope, and file patterns.
2. If scope is unclear, ask whether the rule should always apply or only apply to specific files.
3. If file-specific patterns are unclear, ask for concrete globs such as `**/*.ts` or `apps/rfe-v0/**/*.tsx`.
4. Check whether a rule is the right artifact:
   - Use a skill for reusable workflows.
   - Use a command for explicit user-invoked actions.
   - Use a subagent for isolated specialist work.
   - Use a hook for automatic event behavior.
5. Write a focused `.cursor/rules/<name>.mdc` file under 50 lines when possible.
6. Update `.cursor/README.md` rule inventory.
</process>

<success_criteria>
- Frontmatter includes `description`, `alwaysApply`, and `globs` when relevant.
- The rule is actionable, concise, and repo-specific.
- Concrete examples are included only when they clarify behavior.
- Token usage stays low: avoid broad exploration unless the rule depends on unknown project patterns.
</success_criteria>
