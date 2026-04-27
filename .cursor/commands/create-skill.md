---
name: create-skill
description: Create Cursor Agent Skills for reusable workflows. Use when the user asks to create, write, or refine a skill or SKILL.md file.
argument-hint: [skill purpose]
---

<objective>
Create a concise Cursor skill from `$ARGUMENTS` that teaches a repeatable workflow or domain-specific process.
</objective>

<context>
Use the `create-skill` skill instructions before writing files.

Default to project skills in `.cursor/skills/<skill-name>/SKILL.md` when the workflow is specific to RFE. Use personal skills in `~/.cursor/skills/` only when the user wants cross-project reuse. Never write to `~/.cursor/skills-cursor/`.
</context>

<process>
1. Gather only missing essentials: purpose, location, trigger scenarios, domain knowledge, and output format.
2. Check whether a skill is the right artifact:
   - Use a command for a single user-invoked workflow.
   - Use a subagent for complex isolated work.
   - Use a rule for persistent project guidance.
   - Use a hook for automatic event behavior.
3. Choose a lowercase kebab-case name under 64 characters.
4. Write `SKILL.md` with YAML frontmatter and a concise body under 500 lines.
5. Use progressive disclosure for optional references; keep links one level deep.
6. Update `.cursor/README.md` if a project skill is added or renamed.
</process>

<success_criteria>
- The skill description states what it does and when to use it.
- The body contains only instructions the agent truly needs.
- File paths, terminology, and examples are consistent.
- Token usage stays low: no subagent unless broad discovery or isolated work is actually needed.
</success_criteria>
