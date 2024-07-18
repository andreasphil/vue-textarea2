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
      { id: "example1", name: "Lion 🦁" },
      { id: "example2", name: "Bear 🧸" },
      { id: "example3", name: "Fish 🐟" },
      { id: "example4", name: "Bird 🦆" },
      { id: "example5", name: "Dog 🐕‍🦺" },
    ],
  },
];
</script>

<template>
  <Demo title="Autocomplete">
    <template #description></template>

    <Textarea2 v-model="text" :autocomplete />
  </Demo>
</template>

<style>
menu {
  margin: 0;
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid black;

  li {
    list-style-type: none;
  }
}
</style>
