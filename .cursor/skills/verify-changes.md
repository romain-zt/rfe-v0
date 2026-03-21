# Skill: Verify Changes (Quality Gate)

## When
- Before marking a task as done
- After implementing a step
- After fixing CI/test failures

## Commands to run (minimum)
1) `pnpm test`
   OR, if change is isolated: `pnpm test <FILE>`
2) `pnpm check:fix`

## What to check
- Tests pass
- check:fix reports no remaining issues
- No domain↔infra boundary violations (domain imports)

## Output
- The exact commands you ran
- Any failures + minimal fix plan
- Confirmation that the change is ready to review
