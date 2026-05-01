---
name: improve-config
description: Improve .cursor configuration after a real workflow reveals missing guidance. Use for focused updates to rules, agents, commands, skills, hooks, or README inventory.
argument-hint: [gap or lesson learned]
---

<objective>
Improve `.cursor/` configuration based on a concrete lesson from the RFE migration.

Keep the change small, practical, and grounded in repo-specific experience.
</objective>

<context>
Read `.cursor/README.md` and the specific existing file that may need changing.

If creating or changing an artifact type, use the relevant project command:
- `/create-rule` for persistent AI guidance
- `/create-skill` for repeatable task workflows
- `/create-subagent` for isolated specialist agents
- `/create-command` for slash commands
- `/create-hook` for event automation
</context>

<process>
1. Identify the proven gap from `$ARGUMENTS` or ask one clarifying question.
2. Choose the smallest correct artifact:
   - Rule: persistent project guidance
   - Skill: reusable workflow or domain instructions
   - Subagent: isolated, specialized multi-step work
   - Command: user-invoked single workflow
   - Hook: automatic behavior around agent events
3. Show the current text and proposed focused update when modifying an existing file.
4. Apply only the relevant `.cursor/` edit.
5. Update `.cursor/README.md` when adding, removing, or renaming files.
</process>

<success_criteria>
- The change is based on an actual workflow gap, not speculation.
- The edited file stays concise and references concrete repo paths where useful.
- README inventory is current when files are added, removed, or renamed.
- Simple config edits stay in the main agent; use subagents only for broad exploration or isolated work.
</success_criteria>
