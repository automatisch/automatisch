---
favicon: /favicons/you-need-a-budget.svg
items:
  - name: Category overspent
    desc: Triggers when a category exceeds its budget, resulting in a negative balance.
  - name: Goal completed
    desc: Triggers when a goal is completed.
  - name: Low account balance
    desc: Triggers when the balance of a Checking or Savings account falls below a specified amount within a given month.
  - name: New transactions
    desc: Triggers when a new transaction is created.
---

<script setup>
  import CustomListing from '../../components/CustomListing.vue'
</script>

<CustomListing />
