---
favicon: /favicons/stripe.svg
items:
  - name: New Payouts
    desc: Triggers when stripe sent a payout to a third-party bank account or vice versa.
    org: Stripe Documentation
    orgLink: https://stripe.com/docs/api/payouts/object
  - name: New Balance Transactions
    desc: Triggers when a fund has been moved through your stripe account.
    org: Stripe Documentation
    orgLink: https://stripe.com/docs/api/balance_transactions/object
---

<script setup>
  import CustomListing from '../../components/CustomListing.vue'
</script>

<CustomListing />
