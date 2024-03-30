<script setup lang="ts">
import Textarea2 from "@/components/Textarea2.vue";
import Demo from "@/demo/Demo.vue";
import { ref } from "vue";

const text = ref("Hello world");
</script>

<template>
  <Demo title="Custom styling">
    <template #description>
      <p>
        Apply a class to the component in order to apply custom styling such as
        fonts or colors. Note that if you need styling that changes padding or
        borders, it is recommended you do this by wrapping the textarea in a
        different component and styling that instead. This is because the
        textarea manages some of that by itself (e.g. for overscoll behavior),
        and overriding that from the outside might lead to unexpected behavior.
      </p>
    </template>

    <Textarea2 v-model="text" class="custom" />
  </Demo>
</template>

<style scoped>
.custom {
  caret-color: red;
  font-family: monospace;
  line-height: 1.5;
  font-size: 1.1em;
}
</style>
