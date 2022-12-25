<style scoped>
.announcement-bar {
  background: var(--vp-c-brand-dark);
  color: #fff;
  border-bottom: 2px solid rgba(194, 194, 194, 0.2);
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
  position: fixed;
  padding: 4px 40px;
  z-index: 999999;
  font-size: 0.875rem;
  font-weight: 400;
  width: 100%;
  height: 50px;
}

@media only screen and (max-width: 600px) {
  .announcement-bar {
    font-size: 0.75rem;
  }
}
</style>

<script setup>
import DefaultTheme from 'vitepress/theme';

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #layout-top>
      <div class="announcement-bar">
        <span
          >⭐ If you like what we are doing with Automatisch, please give us a
          star on
          <strong
            ><a
              href="https://github.com/automatisch/automatisch"
              target="_blank"
              rel="noreferrer"
              >GitHub</a
            ></strong
          >.</span
        >
      </div>
    </template>
  </Layout>
</template>
