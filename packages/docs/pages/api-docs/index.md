---
aside: false
outline: false
title: API Docs
---

<OASpec
  hideBranding
  hideServers
  hidePathsSummary
  hideInfo
  spec-url="http://localhost:3000/api/openapi.json"
/>

<script setup>
import { useTheme } from 'vitepress-openapi/client'

useTheme({
  server: {
      allowCustomServer: true,
  },
})
</script>
