<style scoped>
.announcement-bar {
  background: var(--vp-c-brand-dark);
  color: #fff;
  border-bottom: 2px solid rgba(194, 194, 194, 0.2);
  text-align: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  position: fixed;
  padding: 4px 40px;
  z-index: 999999;
  font-size: 0.875rem;
  font-weight: 400;
  text-align: center;
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
