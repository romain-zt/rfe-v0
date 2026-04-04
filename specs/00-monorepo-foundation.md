# Spec 00: Monorepo Foundation

## Context

The repo currently has a single Next.js + Payload app inside `__website-to-migrate/`.
The root `package.json` is an orphaned copy with no lockfile.
No pnpm workspaces, no Turborepo, no shared packages.

## Acceptance Criteria

- [ ] `pnpm-workspace.yaml` exists at root with `apps/*` and `packages/*`
- [ ] pnpm catalog centralizes versions for: react, react-dom, next, typescript, tailwindcss, payload, @payloadcms/*, sharp
- [ ] `__website-to-migrate/` is moved to `apps/rfe-v0/`
- [ ] `apps/rfe-v0/package.json` has `"name": "@rfe/v0"` and uses `catalog:` for shared deps
- [ ] `packages/tsconfig/` provides `base.json`, `nextjs.json`, `react-library.json`
- [ ] `packages/eslint-config/` provides a shared flat config
- [ ] `turbo.json` defines `build`, `dev`, `lint`, `typecheck` tasks
- [ ] `pnpm install` from root succeeds
- [ ] `pnpm build` from root succeeds (Turborepo runs app build)
- [ ] `pnpm dev` from root starts the app
- [ ] `docker compose up -d && pnpm seed` works

## API / Interface Contracts

### pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"

catalog:
  react: "19.2.0"
  react-dom: "19.2.0"
  next: "16.2.2"
  typescript: "^5"
  tailwindcss: "^4.1.9"
  payload: "^3.81.0"
  sharp: "^0.34.5"
```

### Root package.json

- `"private": true`
- `"name": "rfe"`
- Scripts: `dev`, `build`, `lint`, `typecheck`, `clean`, `seed`
- devDependencies: `turbo`

### packages/tsconfig

- `base.json`: strict, ES2022, bundler resolution
- `nextjs.json`: extends base, Next.js plugin, jsx react-jsx
- `react-library.json`: extends base, jsx react-jsx, declaration emit

### packages/eslint-config

- `index.js`: flat config, Next.js + TypeScript rules
- Consumed via `"eslintConfig": { "extends": ["@rfe/eslint-config"] }` or imported in `eslint.config.js`

### turbo.json

```json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "dev": { "persistent": true, "cache": false },
    "lint": { "dependsOn": ["^build"] },
    "typecheck": { "dependsOn": ["^build"] }
  }
}
```

## File Structure

```
rfe-v0/
├── apps/
│   └── rfe-v0/                  # Moved from __website-to-migrate/
│       ├── package.json         # @rfe/v0
│       ├── tsconfig.json        # extends @rfe/tsconfig/nextjs.json
│       ├── payload.config.ts
│       ├── next.config.mjs
│       ├── .env.example
│       └── ...
├── packages/
│   ├── tsconfig/
│   │   ├── package.json         # @rfe/tsconfig
│   │   ├── base.json
│   │   ├── nextjs.json
│   │   └── react-library.json
│   └── eslint-config/
│       ├── package.json         # @rfe/eslint-config
│       └── index.js
├── docker-compose.yml
├── pnpm-workspace.yaml
├── turbo.json
├── package.json                 # root workspace
└── .cursor/
```

## Verification Checklist

- [ ] `pnpm install` — no errors
- [ ] `pnpm build` — exits 0
- [ ] `pnpm dev` — app starts on localhost:3000
- [ ] `docker compose up -d` — postgres + minio healthy
- [ ] `pnpm seed` — admin user created
- [ ] `@/*` path alias resolves correctly in app
- [ ] No orphaned `__website-to-migrate/` directory remains
