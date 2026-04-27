# Spec 10: CMS Typecheck Stabilization

## Context
`packages/cms` expose encore plusieurs erreurs TypeScript strictes (types Payload, seed helpers, typings UI), ce qui empêche une base fiable pour la migration progressive.

## Acceptance Criteria
- [ ] `pnpm --filter @rfe/cms exec tsc --noEmit` passe sans erreur
- [ ] Aucune réintroduction de `any` ou `unknown` non borné
- [ ] Les seeds restent rerunnable (logique upsert conservée)
- [ ] Le build de l’app n’est pas régressé par les corrections CMS

## API / Interface Contracts
- `buildRfeConfig` reste compatible avec la config SEO/plugin actuelle.
- `runSeed` conserve la même signature publique.
- Les seeds `forms`, `team`, `works` continuent d’utiliser l’API locale Payload.

## File Structure
Fichiers ciblés:
- `packages/cms/src/components/ColorPickerField/index.tsx`
- `packages/cms/src/config.ts`
- `packages/cms/src/seed/run-seed.ts`
- `packages/cms/src/seed/seed-forms.ts`
- `packages/cms/src/seed/seed-team.ts`
- `packages/cms/src/seed/seed-works.ts`

## Verification Checklist
- [ ] `pnpm --filter @rfe/cms exec tsc --noEmit`
- [ ] `pnpm --filter @rfe/v0 generate:types`
- [ ] `pnpm --filter @rfe/v0 typecheck` (erreurs CMS absentes)
