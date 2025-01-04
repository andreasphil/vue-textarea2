<h1 align="center">
  Textarea2 🦋
</h1>

<p align="center">
  <strong>A better plain-text input component for Vue</strong>
</p>

> [!IMPORTANT]
>
> This has been re-implemented as a [native web component](https://github.com/andreasphil/textarea2) and is no longer maintained.

- 🤩 Helpful, unobtrusive UX improvements like tabs and continuing lists
- 🛠️ Highly customizable to support syntax highlighting, custom lists, and more
- ✅ Support for autocompletions for slash commands, mentions, etc.
- 👌 Fully typed and tested
- 🐛 Tiny (<6kb min+gzip) footprint

## Installation

With a package manager:

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

### Textarea context

The textarea exposes a `withContext` method which you can use for interacting with it. It gives you access to the current `EditingContext`, which includes, for example, methods for focusing and adjusting the selection, current selection, etc.:

```vue
<script setup lang="ts">
import VueTextarea2 from "@andreasphil/vue-textarea2";

const text = ref("Hello world!");

const textareaEl = ref(null);

function doSomething() {
  textareaEl.value?.withContext((context) => {
    // ...
  });
}
</script>

<template>
  <VueTextarea2 v-model="text" ref="textareaEl" />
</template>
```

To learn more about the available props, check out the docs in [Textarea2.vue](./src/components/Textarea2.vue). For examples, see [the demos](./src/demo).

### Styling

The component only implements the absolute minimum of styling that is needed for layout and positioning. Anything else is intentionally left out to make it easy to customize for different applications and styles. There are two options:

- The component is designed to work and look nice out of the box when used on pages using [@andreasphil/design-system](https://github.com/andreasphil/design-system).

- Alternatively, you can provide your own styles with a few lines of CSS. See [textarea2.css](./src/assets/textarea2.css) for an example and further information.

### Text utilities

In addition, this library exposes a bunch of utilities for [manipulating text](./src/lib/text.ts). Those are used internally by the textarea, but can also be useful when extending its functionality:

```ts
import { /*...*/ } "@andreasphil/vue-textarea2/text";
```

## Development

Textarea2 is compatible with [Vue 3](https://vuejs.org) and built with [Vite](https://vitejs.dev). Packages are managed by [pnpm](https://pnpm.io). Tests are powered by [Vitest](https://vitest.dev). The following commands are available:

```sh
pnpm dev          # Start development server
pnpm test         # Run tests once
pnpm test:watch   # Run tests in watch mode
pnpm build        # Bundle for production
```

## Credits

This library uses a number of open source packages listed in [package.json](package.json).

Thanks 🙏
