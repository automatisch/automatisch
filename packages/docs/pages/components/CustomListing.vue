<script setup>
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import { VPTeamMembers } from 'vitepress/theme';

const { frontmatter: fm } = useData();

const computedItems = computed(() => {
  const itemsLength = fm.value.items?.length;

  if (!itemsLength) return [];

  return fm.value.items.map((item) => {
    return {
      ...item,
      avatar: withBase(fm.value.favicon),
    };
  });
});
</script>

<template>
  <VPTeamMembers size="small" :members="computedItems" />
</template>
