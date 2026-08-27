# Phase 1 architecture

The API Gateway is the public HTTP entry point. Auth issues customer JWTs. Database-owning services never share tables or make cross-database joins. Checkout is an orchestrator: it reads the authenticated cart, resolves product prices, validates a promotion, checks fraud, reserves inventory, simulates payment, creates an order and shipment, then sends notification/analytics events. If checkout fails after stock reservation, it compensates by releasing reserved inventory.

RabbitMQ support is intentionally optional in this phase so HTTP flows can be learned without requiring infrastructure first. Redis is optional and used as a search cache; search falls back to product-service when Redis is absent.
