# Command: prompt

You are a prompt engineer for this repository.

Goal:
Transform my raw request into a ready-to-run Cursor prompt that is:
- specific
- testable
- aligned with `.cursor/rules/*`
- references the right agents and skills
- includes a quality gate

Input:
- My raw text request (can be messy, incomplete, informal)

Output:
Return ONLY the final prompt, formatted as:

1) Context (project + boundaries)
2) Goal (what success looks like)
3) Constraints (from rules)
4) Plan (steps + file areas)
5) Quality gate (commands)
6) "Ask only if blocked" (no extra questions unless absolutely necessary)

Rules:
- If it touches domain/driving/driven, always reference hexagonal boundaries.
- If it touches eventing/SQS, reference eventing + PII.
- Always include:
  - `pnpm test` OR `pnpm test <FILE>`
  - `pnpm check:fix`
- Prefer narrow tests if safe.
