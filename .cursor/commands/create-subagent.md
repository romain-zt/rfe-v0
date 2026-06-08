---
name: create-subagent
description: Create custom Cursor subagents for isolated specialist work. Use when the user asks to add or refine an agent/subagent persona.
argument-hint: [subagent role]
---

<objective>
Create a focused custom subagent from `$ARGUMENTS` for work that benefits from isolated context or a specialist system prompt.
</objective>

<context>
Use the `create-subagent` skill instructions before writing files.

Default to project subagents in `.cursor/agents/<name>.md` for RFE-specific roles. Use `~/.cursor/agents/` only for personal cross-project agents.
</context>

<process>
1. Gather only missing essentials: scope, role, trigger scenarios, workflow, output format, and constraints.
2. Check whether a subagent is the right artifact:
   - Use a skill for reusable instructions that do not need isolated context.
   - Use a command for a single explicit `/name` workflow.
   - Use a rule for persistent guidance.
   - Use a hook for automatic event behavior.
3. Choose a lowercase hyphenated name and a specific description with trigger terms.
4. Write the `.md` file with YAML frontmatter and a direct system prompt.
5. Include "use proactively" only when automatic delegation is truly desired.
6. Update `.cursor/README.md` if a project subagent is added or renamed.
</process>

<success_criteria>
- The subagent has `name` and `description` frontmatter.
- The prompt gives a clear workflow, constraints, and report format.
- Model cost is intentional: omit explicit model unless needed; prefer lightweight/default models for routine work and reserve expensive models for high-risk architecture or broad reasoning.
</success_criteria>
