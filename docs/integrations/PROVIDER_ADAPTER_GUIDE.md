# Sprint 5.12 — Provider Adapter Guide

How to add a new provider to any integration category (using Payment as
the worked example — Shipping/Email/SMS follow the identical shape).

## 1. Implement the interface
```ts
// src/integrations/payment/providers/my-provider.provider.ts
@Injectable()
export class MyProviderPaymentProvider implements PaymentProvider {
  readonly name = "my-provider";
  async initiatePayment(input) { /* ... */ }
  async verifyPayment(ref) { /* ... */ }
  async initiateRefund(input) { /* ... */ }
  verifyWebhookSignature(rawBody, signatureHeader) { /* ... */ }
}
```

## 2. Never throw in the constructor for missing credentials
**This is the #1 mistake this sprint's own review caught** (see
`SPRINT_5_VALIDATION.md`) — a provider class is instantiated by Nest's
DI container regardless of whether it's the *selected* provider.
Throwing in the constructor when a credential is missing crashes app
boot in every environment that hasn't configured that specific
provider — even ones using a completely different one. Defer the
credential check to each method that actually needs it
(`assertConfigured()` pattern in `StripePaymentProvider`).

## 3. Register it in the module
```ts
// payment.module.ts
providers: [
  MockPaymentProvider,
  MyProviderPaymentProvider, // add here
  {
    provide: PAYMENT_PROVIDER,
    inject: [ConfigService, MockPaymentProvider, StripePaymentProvider, MyProviderPaymentProvider],
    useFactory: (config, mock, stripe, myProvider) => {
      const selected = config.get<string>("payment.provider");
      if (selected === "my-provider") return myProvider;
      return selected === "stripe" ? stripe : mock;
    },
  },
  // ...
],
```

## 4. Add the config
```ts
// configuration.ts
payment: {
  provider: process.env.PAYMENT_PROVIDER ?? "mock",
  myProvider: { apiKey: process.env.MY_PROVIDER_API_KEY },
},
```

## 5. Write the same test shape as the existing mock's tests
See `src/integrations/payment/__tests__/mock-payment.provider.spec.ts`
for the pattern: exercise every interface method, plus signature
verification specifically (sign a payload, verify it, tamper with it,
confirm rejection).

## Webhook Signature Schemes Reference
| Provider | Scheme | Header |
|---|---|---|
| Mock | HMAC-SHA256 over raw body | `x-webhook-signature` |
| Stripe (real) | HMAC-SHA256 over `${timestamp}.${rawBody}` | `Stripe-Signature`, format `t=...,v1=...` |
| Razorpay (not implemented — see Known Issues) | HMAC-SHA256 over raw body | `X-Razorpay-Signature` |
