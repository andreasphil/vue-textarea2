<script setup lang="ts">
import CustomStylingDemo from "@/demo/CustomStylingDemo.vue";
import ReadonlyDemo from "@/demo/ReadonlyDemo.vue";
import SimpleDemo from "@/demo/SimpleDemo.vue";
import SyntaxHighlightingDemo from "@/demo/SyntaxHighlightingDemo.vue";
import { onMounted, ref, watch } from "vue";

/* -------------------------------------------------- *
 * Simple routing                                     *
 * -------------------------------------------------- */

const route = ref("");

watch(route, (value) => {
  location.hash = value;
});

onMounted(() => {
  addEventListener("hashchange", (event) => {
    if (event.target && event.target instanceof Window) {
      route.value = event.target.location.hash;
    }
  });

  if (!location.hash || location.hash === "#") route.value = "simple";
  else route.value = location.hash;
});
</script>

<template>
  <h1>Textarea2 Demo</h1>
  <nav>
    <ul>
      <li>
        <a href="#simple">Simple</a>
      </li>
      <li>
        <a href="#custom-styling">Custom styling</a>
      </li>
      <li>
        <a href="#syntax-highlighting">Syntax highlighting</a>
      </li>
      <li>
        <a href="#readonly">Readonly</a>
      </li>
    </ul>
  </nav>

  <SimpleDemo v-if="route === '#simple'" />
  <CustomStylingDemo v-else-if="route === '#custom-styling'" />
  <SyntaxHighlightingDemo v-else-if="route === '#syntax-highlighting'" />
  <ReadonlyDemo v-else-if="route === '#readonly'" />
</template>

<style>
body {
  margin: auto;
  max-width: 50rem;
  font-family: ui-sans, system-ui, sans-serif;
  line-height: 1.5em;
  padding: 6rem 1rem;
}

h1 {
  margin-top: 0;
}

nav ul {
  display: flex;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin-bottom: 3rem;
}
</style>
