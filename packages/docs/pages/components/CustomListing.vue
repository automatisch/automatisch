<script setup>
import { useData } from 'vitepress';
import { VPTeamMembers } from 'vitepress/theme';

const props = defineProps(['favicon']);

const { frontmatter: fm } = useData();
</script>

<template>
  <VPTeamMembers size="small" :members="fm.items" />
</template>
