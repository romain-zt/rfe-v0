# Skill: Add SQS consumer

## Input
- Queue URL env var name
- Event detail types to handle
- Domain service to call

## Process
1. Add DTOs in `src/driving/nest/sqs/dto/` with `parseAndValidate` (Zod or class-validator).
2. Add consumer extending `SqsConsumer` in `src/driving/nest/sqs/`.
3. Implement `messageHandler`: parse body → switch on `detailType` → validate → call domain.
4. Register in `SqsModule`; inject domain port.
5. Ensure idempotency if at-least-once (e.g. upsert, idempotency key).
6. No PII in logs; log `messageId` only.

## Output
- DTOs in `src/driving/nest/sqs/dto/`
- Consumer in `src/driving/nest/sqs/<name>.consumer.ts`
- SqsModule provider update

## Tests to run
- `pnpm test` (unit for consumer if extracted)
- `pnpm check`
- Component test if critical path
