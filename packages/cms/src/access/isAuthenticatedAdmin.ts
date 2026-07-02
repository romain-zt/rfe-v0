import type { FieldAccess } from 'payload'

export const isAuthenticatedAdmin: FieldAccess = ({ req }) => Boolean(req.user)
