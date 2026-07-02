# Spec 13: Email Settings Tab

## Context
The admin needs a dedicated place to manage SMTP email settings from the CMS with ready-made presets for common providers such as Google and Outlook. These values include sensitive credentials, while the existing `site-config` global is also consumed by the public frontend and therefore cannot be locked down wholesale.

## Acceptance Criteria
- [ ] `site-config` contains an `Email` tab in the admin UI
- [ ] The email tab supports common SMTP providers with presets for host, port, and security
- [ ] The SMTP password is masked in the admin UI
- [ ] Email settings are not readable through public API access
- [ ] Only authenticated admin users can read or update the email configuration fields
- [ ] A deterministic seed initializes the email settings structure without a real secret
- [ ] Payload types regenerate successfully

## API / Interface Contracts
- `site-config.email.provider` supports named presets and a custom SMTP mode
- `site-config.email.smtpPassword` remains optional and masked in the admin
- `site-config.email` is omitted from public consumers unless requested in an authenticated admin context

## File Structure
```text
packages/cms/src/
  access/isAuthenticatedAdmin.ts
  globals/SiteConfig.ts
  seed/seed-site-config.ts

specs/
  13-email-settings-tab.md
```

## Verification Checklist
- [ ] `pnpm --filter @rfe/v0 generate:types`
- [ ] `pnpm build`
- [ ] `pnpm lint`
- [ ] `/admin/globals/site-config` shows an `Email` tab
- [ ] The password input is masked by default
- [ ] Non-authenticated API reads do not include the email secret fields
