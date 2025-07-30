<template>
  <div id="swagger-ui"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import SwaggerUI from 'swagger-ui-dist/swagger-ui-es-bundle.js';
import 'swagger-ui-dist/swagger-ui.css';

onMounted(() => {
  SwaggerUI({
    dom_id: '#swagger-ui',
    url:
      import.meta.env.VITE_OPENAPI_JSON_URL ||
      'http://localhost:3000/api/openapi.json',
    presets: [SwaggerUI.presets.apis],
    layout: 'BaseLayout',
  });
});
</script>

<style scoped>
#swagger-ui {
  margin-top: 2rem;
}
</style>
