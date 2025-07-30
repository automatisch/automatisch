---
aside: false
outline: false
title: API Docs
---

<script setup lang="ts">
import { useRoute } from 'vitepress'

const route = useRoute()

const operationId = route.data.params.operationId
</script>

<OAOperation
  hideBranding
  hideServers
  hidePathsSummary
  hideInfo
  :operationId="operationId"
/>
