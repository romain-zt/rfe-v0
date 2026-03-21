# Command: plan

Use architect agent. Follow `.cursor/rules/00-project-context.mdc` and `10-hexagonal-boundaries.mdc`.

**Input**: Feature or change description.

**Output**:
1. File list (domain, driving, driven).
2. Ports to add/implement.
3. Step-by-step implementation order.
4. Reference skills: `add-usecase`, `add-driven-adapter`, `add-driving-endpoint`, `add-sqs-consumer`, `add-eventbridge-dispatch`, `add-drizzle-migration`.

Keep diffs small; one logical change per step.
