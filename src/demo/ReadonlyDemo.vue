<script setup lang="ts">
import Textarea2 from "@/components/Textarea2.vue";
import Demo from "@/demo/Demo.vue";
import { ref } from "vue";

const text = ref("Hello world");
</script>

<template>
  <Demo title="Readonly">
    <template #description>
      <p>This textarea cannot be changed.</p>
    </template>

    <Textarea2 v-model="text" readonly />
  </Demo>
</template>
