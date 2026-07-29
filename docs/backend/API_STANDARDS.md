# Sprint 3.10/3.6 — API Standards & Documentation

## Versioning
URI versioning, every route prefixed `/v1/...` (`main.ts`
`enableVersioning`). Per Phase 8 §5: "no unversioned endpoint is ever
shipped."

## OpenAPI / Swagger
Generated at boot via `@nestjs/swagger`, served at `GET /api/docs`
(interactive UI) once the app is running. `DocumentBuilder` config is in
`main.ts`. Every controller carries `@ApiTags`; protected controllers
carry `@ApiBearerAuth`. DTOs use `@ApiProperty`/`@ApiPropertyOptional`
so request/response shapes appear in the generated spec automatically —
no hand-maintained API doc to drift from the code.

**Not yet verified live** — same sandbox constraint as every other
"does it actually run" item this sprint; see
`docs/sprint-reports/SPRINT_3_VALIDATION.md`.

## Error Response Shape (Phase 16 §16.16)
Every error, from every module, returned by `GlobalExceptionFilter`:
```json
{
  "statusCode": 404,
  "errorCode": "NOT_FOUND",
  "message": "Product not found.",
  "path": "/v1/products/does-not-exist",
  "timestamp": "2026-07-28T00:00:00.000Z",
  "requestId": "..."
}
```

## Success Response Envelope (Phase 16 §16.16)
Every successful response, from every module, wrapped by
`ResponseEnvelopeInterceptor`:
```json
{
  "data": { "...": "..." },
  "meta": { "timestamp": "2026-07-28T00:00:00.000Z" }
}
```
List endpoints additionally nest pagination inside `data`
(`PaginatedResponse` — `{ items, meta: { page, pageSize, totalItems, totalPages } }`),
per Phase 8 §5's pagination requirement.

## Validation
Global `ValidationPipe` (`whitelist: true, forbidNonWhitelisted: true,
transform: true`) — every request body validated against its DTO's
`class-validator` decorators before reaching a controller method.
Rejected requests return field-level detail in the error `details` array
(Phase 16 §16.16: "validation failures return field-level detail
matching the frontend's error-presentation expectations").

## Logging & Monitoring Hooks
`RequestLoggingInterceptor` logs every request with a request ID, the
handling module (controller class name), duration, and outcome (Phase
16 §16.16). `GET /v1/health/live` and `/v1/health/ready` are the
monitoring hooks per Phase 8 §11 — `/ready` actually pings the database,
`/live` is a bare liveness check.
