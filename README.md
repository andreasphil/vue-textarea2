<h1 align="center">
  Textarea2 🪼
</h1>

<p align="center">
  <strong>A better plain-text input component for Vue</strong>
</p>

> ⚠️ Work in progress. Things are most certainly incomplete and/or broken, and will definitely change.

- 😌 Helpful, unobstrusive UX improvements like tabs and continuing lists
- 🌱 Extensible to support custom syntax highlighting, interactions, and more
- 👌 Fully typed and tested
- 🛝 Check out Tasks for a [demo](https://tasks.a13i.dev) and [example usage](https://github.com/andreasphil/tasks)

## Installation

```sh
npm i github:andreasphil/vue-textarea2#<tag>
```

## Usage

Import the styling for the textarea in your `App.vue` (or where you need it):

```ts
import "@andreasphil/vue-textarea2/style.css";
```

You can then use the component:

```vue
<script setup lang="ts">
import VueTextarea2 from "@andreasphil/vue-textarea2";

const text = ref("Hello world!");
</script>

<template>
  <VueTextarea2 v-model="text" />
</template>
```

The textarea exposes a `withContext` method which you can use for interacting with it. It gives you access to the current `EditingContext`, which includes, for example, methods for focusing and adjusting the selection, current selection, etc.:

```
<script setup lang="ts">
import VueTextarea2 from "@andreasphil/vue-textarea2";

const text = ref("Hello world!")

const textareaEl = ref(null);

function doSomething() {
  textareaEl.value?.withContext((context) => {
    // ...
  })
}
</script>

<template>
  <VueTextarea2 v-model="text" ref="textareaEl" />
</template>
```

To learn more about the available props, check out the docs in [Textarea2.vue](./src/components/Textarea2.vue). For examples, see [the demos](./src/demo).

In addition, this package exposes a bunch of utilities for [manipulating text](./src/lib/text.ts). Those are used internally by the textarea, but can also be useful when extending its functionality:

```ts
import { /*...*/ } "@andreasphil/vue-textarea2/text";
```

## Development

The library is compatible with [Vue 3](https://vuejs.org) and built with [Vite](https://vitejs.dev). Packages are managed by [pnpm](https://pnpm.io). Tests are powered by [Vitest](https://vitest.dev). The following commands are available for developing and running the demo:

```
pnpm run dev       # Start development server
pnpm run build     # Create a production bundle
pnpm run test      # Run tests
```

## Credits

This library uses a number of open source packages listed in [package.json](package.json).

Thanks 🙏
