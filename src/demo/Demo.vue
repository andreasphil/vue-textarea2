<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <h2>{{ title }}</h2>
  <slot name="description" />

  <article>
    <slot />
  </article>
</template>

<style scoped>
article {
  border: 1px dashed gray;
  margin: 3rem 0;
  padding: 0.5rem;
}
</style>
