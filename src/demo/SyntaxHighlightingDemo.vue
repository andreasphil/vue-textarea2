<script setup lang="ts">
import Textarea2 from "@/components/Textarea2.vue";
import Demo from "@/demo/Demo.vue";
import { ref } from "vue";

const text = ref(`# Hello world!

> This is a quote

This is regular text.`);

type HighlightedRow = {
  color: string;
};

function contextProvider(row: string): HighlightedRow {
  if (row.startsWith("#")) return { color: "black" };
  else if (row.startsWith(">")) return { color: "blue" };
  else return { color: "gray" };
}
</script>

<template>
  <Demo title="Syntax highlighting">
    <template #description>
      <p>
        The textarea supports very simple syntax highlighting through so-called
        "row contexts". The example below shows how this could look like for a
        (extremely simplified) markdown highlighting. Headings (prefixed with a
        single <code>#</code>) should appear black, blockquotes (prefixed with a
        single <code>></code>) blue, and everything else grey.
      </p>
      <p>
        It works like this: You can provide the textarea component with a
        context provider. That provider is a simple function that takes a single
        row of text from the textarea as a string and returns any object. This
        context provider is called for each row whenever the value of the
        textarea changes:
      </p>
      <pre>
  function contextProvider(row: string) {
    if (row.startsWith("#")) return { color: "black" };
    else if (row.startsWith(">")) return { color: "blue" };
    else return { color: "gray" };
  }</pre
      >
      <p>
        The textarea will call the provider for each row individually. The
        result will then be available to you in the <code>row</code> slot of the
        component. You can use this to customize what the output will look like:
      </p>
      <pre>
  &lt;Textarea2 v-model="text" :context-provider="contextProvider"&gt;
    &lt;template #row="{ context, row }"&gt;
      &lt;div :style="{ color: context.color }"&gt;
        &#123;&#123; row &#125;&#125;
      &lt;/div&gt;
    &lt;/template&gt;
  &lt;/Textarea2&gt;</pre
      >
      <p>
        This can get you some cool results with very little effort, but also has
        some limitations:
      </p>
      <ul>
        <li>
          The context provider is going to be called frequently, so try to keep
          it simple and/or use caching to improve performance.
        </li>
        <li>
          Because the highlighting is implemented through a div that is rendered
          on top of the textarea, the result needs to occupy the exact same
          space as the original text, otherwise cursor positioning will be off.
          This means, for example, that if you need different font weights
          you'll need to use a monospaced font.
        </li>
      </ul>
      <p>
        For a more advanced example, check out
        <a href="https://github.com/andreasphil/tasks">Tasks</a>.
      </p>
    </template>

    <Textarea2 v-model="text" :context-provider="contextProvider">
      <template #row="{ context, row }">
        <div :style="{ color: context.color }">
          {{ row }}
        </div>
      </template>
    </Textarea2>
  </Demo>
</template>

<style scoped></style>
