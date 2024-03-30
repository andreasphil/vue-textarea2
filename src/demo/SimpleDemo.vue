<script setup lang="ts">
import Textarea2 from "@/components/Textarea2.vue";
import Demo from "@/demo/Demo.vue";
import { ref } from "vue";

const text = ref("Hello world!");
</script>

<template>
  <Demo title="Simple">
    <template #description>
      <p>
        The textarea with all default settings unchanged and no additional
        configuration. Try this:
      </p>

      <ul>
        <li>
          Numbered lists and lists starting with <code>-</code> or
          <code>*</code> should continue automatically.
        </li>
        <li>
          Press <kbd>tab</kbd> or <kbd>shift+tab</kbd> to indent or outdent the
          current line.
        </li>
        <li>
          Press <kbd>option+arrow up</kbd> or <kbd>option+arrow down</kbd> to
          flip two lines.
        </li>
        <li>
          Copy or cut when nothing is selected to copy or cut the entire line.
        </li>
      </ul>
    </template>

    <Textarea2 v-model="text" />
  </Demo>
</template>
