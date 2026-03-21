# Skill: Add driving endpoint (HTTP)

## Input
- Route (e.g. `POST /admin/enrollments`)
- DTO shape
- Domain service/port to call

## Process
1. Add DTO in `src/driving/nest/http/dto/` (class-validator).
2. Add or extend controller in `src/driving/nest/http/`.
3. Inject domain port; map DTO → domain input; call port; map result → response.
4. Add controller spec: `*.controller.spec.ts`.
5. Add `.http` file for manual testing if useful.

## Output
- DTO file
- Controller method
- Controller spec

## Tests to run
- `pnpm test src/driving/nest/http/*.controller.spec.ts`
- `pnpm check`
- Component test in `src/component-tests/` if user-facing
