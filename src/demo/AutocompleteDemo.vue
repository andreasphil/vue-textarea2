<script setup lang="ts">
import Textarea2, { AutoComplete } from "@/components/Textarea2.vue";
import { ref } from "vue";
import Demo from "./Demo.vue";

const text = ref("");

const autocomplete: AutoComplete[] = [
  {
    trigger: "/",
    id: "slashcommand",
    commands: [
      {
        id: "example1",
        name: "Lion",
        icon: () => "🦁",
        initial: true,
        value: "Lion 🦁",
      },
      {
        id: "example2",
        name: "Bear",
        icon: () => "🧸",
        initial: true,
        value: "Bear 🧸",
      },
      { id: "example3", name: "Fish", icon: () => "🐟", value: "Fish 🐟" },
      { id: "example4", name: "Bird", icon: () => "🦆", value: "Bird 🦆" },
      { id: "example5", name: "Dog", icon: () => "🐕‍🦺", value: "Dog 🐕‍🦺" },
    ],
  },
];
</script>

<template>
  <Demo title="Autocomplete">
    <template #description>
      <p>
        The autocomplete feature allows you to implement inline-actions such as
        slash commands. You can define one or multiple characters to trigger the
        completion, and a list of commands for each trigger. The commands will
        be filtered as the user types, and the text typed after the trigger char
        (as well as the trigger char) will be replaced by the value associated
        with the command.
      </p>
      <p>In the textarea above, try <kbd>/</kbd> with animal names.</p>
      <p>Example:</p>
      <pre>
&lt;script setup&gt;
  const autocomplete: AutoComplete[] = [
    {
      trigger: "/",
      id: "slashcommand",
      commands: [
        { id: "example1", name: "Lion", value: "Lion 🦁" },
        { id: "example2", name: "Bear", value: "Bear 🧸" },
        { id: "example3", name: "Fish", value: "Fish 🐟" },
        { id: "example4", name: "Bird", value: "Bird 🦆" },
        { id: "example5", name: "Dog", value: "Dog 🐕‍🦺" },
      ],
    },
  ];
&lt;/script&gt;

&lt;template&gt;
  &lt;Textarea2 :autocomplete /&gt;
&lt;/template&gt;</pre
      >
      <p>
        Like the textarea, the menu doesn't come with any styling beyond the
        bare minimum required for layout. You'll need to style the
        <code>menu</code>, <code>li</code>, and <code>button</code> elements, as
        well as the <code>button[data-active="true"]</code> attribute for the
        selected item. Check out the source of this
        <a
          href="https://github.com/andreasphil/vue-textarea2/tree/main/src/demo"
          >demo</a
        >
        for an example.
      </p>
    </template>

    <Textarea2 v-model="text" :autocomplete :class="$style.acDemo" />
  </Demo>
</template>

<style module>
.acDemo {
  menu {
    margin: 0;
    padding: 0.5rem;
    background-color: white;
    border: 1px solid black;

    li {
      list-style-type: none;

      & + & {
        margin-top: 0.25rem;
      }
    }

    button {
      font: inherit;
      background-color: white;
      border: 1px solid black;
      padding: 0.25rem 0.5rem;
      display: block;
      width: 100%;

      &[data-active="true"] {
        background-color: lightskyblue;
      }
    }
  }
}
</style>
