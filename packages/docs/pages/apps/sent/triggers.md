---
favicon: /favicons/sent.svg
items:
  - name: New event
    desc: Triggers when Sent reports a message lifecycle event (queued, sent, delivered, read, failed, blocked, received and more) or a template status change.
  - name: New message received
    desc: Triggers when a contact sends a message to one of your Sent numbers on SMS, WhatsApp or RCS.
---

<script setup>
  import CustomListing from '../../components/CustomListing.vue'
</script>

<CustomListing />

## How the triggers work

- Both triggers are webhook-based. When you publish a flow, Automatisch creates a webhook in your Sent account named after the flow; when you unpublish or delete the flow, the webhook is removed. Each flow gets its own webhook and signing secret, so several flows can share one Sent connection.
- Sent must be able to reach your Automatisch installation, so the webhook URL has to be public. For local development set the `WEBHOOK_URL` environment variable to a public tunnel URL (for example from ngrok) before publishing the flow.
- Every delivery is verified against the webhook's signing secret before the flow runs, and deliveries older than five minutes are rejected. Sent retries failed deliveries; Automatisch runs the flow once per event even when a delivery is retried.
- **Test trigger** replays the last event received by the flow. Before the first real event it uses a sample event so you can map fields.
- The trigger output is the Sent event: `field`, `event` (for example `message.delivered` or `message.received`), `timestamp` and `payload`. Inbound messages expose `payload.inbound_number` (the contact), `payload.outbound_number` (your number), `payload.text`, `payload.channel`, `payload.message_id` and `payload.received_at`. Message status events expose `payload.message_id`, `payload.message_status`, `payload.channel`, `payload.outbound_number` and template details.
