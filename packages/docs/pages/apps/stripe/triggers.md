---
favicon: /favicons/stripe.svg
items:
  - name: New payouts
    desc: Triggers when stripe sent a payout to a third-party bank account or vice versa.
    org: Stripe documentation
    orgLink: https://stripe.com/docs/api/payouts/object
  - name: New balance transactions
    desc: Triggers when a fund has been moved through your stripe account.
    org: Stripe documentation
    orgLink: https://stripe.com/docs/api/balance_transactions/object
---

<script setup>
  import CustomListing from '../../components/CustomListing.vue'
</script>

<CustomListing />
