---
favicon: /favicons/sent.svg
items:
  - name: Send message
    desc: Sends an SMS, WhatsApp or RCS message to one or more recipients. Sent accepts the message for delivery (HTTP 202); track delivery with Get message status, Get message activities or the New event trigger.
  - name: Get message status
    desc: Retrieves the current status and details of a message, including its lifecycle events.
  - name: Get message activities
    desc: Retrieves the activity log of a message (queued, routed, sent, delivered, read, failed, blocked and more).
  - name: List contacts
    desc: Retrieves one page of contacts, optionally filtered by search term, phone number or channel.
  - name: Get contact
    desc: Retrieves a contact by ID, including phone number formats, available channels and opt-out status.
  - name: Get phone number details
    desc: Looks up a phone number and returns its validity, country, carrier, line type, porting and VoIP information.
  - name: Get account
    desc: Retrieves the account behind the connection, including its type, channels, sending number and sender profiles.
  - name: API Request
    desc: Make a custom API request using this app's authentication.
---

<script setup>
  import CustomListing from '../../components/CustomListing.vue'
</script>

<CustomListing />

## Send message

- **Recipient Phone Numbers** must be in E.164 format (for example `+14155550100`). Separate several recipients with commas; Sent creates one message per recipient.
- **Channel**: *Automatic routing* lets Sent choose SMS, WhatsApp or RCS per recipient using your routing rules and fall back between channels. Pinning SMS, WhatsApp or RCS never falls back. Listing several channels separated by commas sends a separate message on each channel.
- **Content Type**: choose *Text message* for free-form text or *Approved template* to pick one of your approved templates. When a template is selected, one input per template variable appears.
- Free-form text needs an open conversation. For SMS, RCS and automatic routing the contact must have replied to you before, or have received an approved template from you in the last 7 days. For WhatsApp, the contact must have messaged you in the last 24 hours. Otherwise Sent accepts the request but the message ends as `BLOCKED` (SMS/RCS) or `FAILED` (WhatsApp). Sending an approved template first opens the conversation.
- **Sandbox**: validates the request and returns a simulated response without sending anything.
- **Idempotency Key**: Sent returns the original response for repeated sends with the same key within 24 hours. When empty, Automatisch uses a key derived from the current execution.
- A successful send returns HTTP 202: the message is **accepted and queued**, not yet delivered. The response contains one `message_id` per recipient and channel under `data.recipients`. Use *Get message status*, *Get message activities* or the *New event* trigger to learn whether the message was delivered, read, failed, filtered or blocked.

## API Request

The generic API Request action can call any `https://api.sent.dm/v3/...` endpoint with the connection's API key. Requests to other hosts or API versions are rejected, and a custom `x-api-key` header is always replaced by the connection's key. Add `x-profile-id` or `Idempotency-Key` headers when needed.
