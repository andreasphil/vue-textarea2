<script setup lang="ts">
import AutocompleteDemo from "@/demo/AutocompleteDemo.vue";
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
  <main>
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
          <a href="#autocomplete">Autocomplete</a>
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
    <AutocompleteDemo v-else-if="route === '#autocomplete'" />
    <SyntaxHighlightingDemo v-else-if="route === '#syntax-highlighting'" />
    <ReadonlyDemo v-else-if="route === '#readonly'" />
  </main>
</template>
