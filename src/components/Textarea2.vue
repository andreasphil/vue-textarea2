<script setup lang="ts" generic="RowContext extends Record<string, any>">
import * as text from "@/lib/text";
import { computed, nextTick, reactive, ref, watch, watchEffect } from "vue";

type ContextProvider = (row: string) => RowContext;

const props = withDefaults(
  defineProps<{
    /**
     * When true, the order of two lines can be flipped by pressing option +
     * arrow up/down.
     */
    allowFlipLines?: boolean;

    /** Settings for autocompletion. Set to `null` to disable. */
    autocomplete?: null | AutoComplete[];

    /**
     * A function that returns an object that provides additional information
     * about a line of text in the textarea. This information will be available
     * in the slot for customizing the output, and can be used to add
     * highlighting or render other components.
     */
    contextProvider?: ContextProvider;

    /**
     * When true, will automatically continue lists according to the defined
     * rules. Note that setting this prop will replace the default rules. If
     * you want to extend them instead, import the defaults from `text` and
     * add your own to them.
     */
    continueLists?: false | text.ContinueListRule[];

    /**
     * When true, pressing cmd + x without a selection will cut the entire
     * line.
     */
    cutFullLine?: boolean;

    /**
     * When true, pressing cmd + shift + k without a selection will delete the
     * entire line.
     */
    deleteLine?: boolean;

    /**
     * When true, pressing cmd + shift + d without a selection will duplicate
     * the entire line.
     */
    duplicateLine?: boolean;

    /**
     * When true, pressing tab or shift + tab will indent or outdent the line.
     */
    insertTabs?: boolean;

    /**
     * When true, pasting anything that counts as a list according to the
     * `continueLists` prop will be adjusted to match the current list (if
     * there is one).
     */
    mergeListsOnPaste?: boolean;

    /**
     * Value of the textarea.
     */
    modelValue: string;

    /**
     * When true, the textarea can not be edited. Note that if you render any
     * custom controls in rows, you'll need to make them readonly separately.
     */
    readonly?: boolean;

    /**
     * When true, adds additional margin at the end of the textarea.
     */
    scrollBeyondLastLine?: boolean | number;

    /**
     * When true, the browser's spellchecking is enabled for the textarea.
     */
    spellcheck?: boolean;

    /**
     * Set the size of tabs to a custom character count.
     */
    tabSize?: number;
  }>(),
  {
    allowFlipLines: true,
    autocomplete: null,
    contextProvider: (_: string) => ({} as RowContext),
    continueLists: () => Object.values(text.continueListRules),
    cutFullLine: true,
    deleteLine: true,
    duplicateLine: true,
    insertTabs: true,
    mergeListsOnPaste: true,
    readonly: false,
    scrollBeyondLastLine: true,
    spellcheck: true,
    tabSize: 4,
  }
);

const emit = defineEmits<{
  /**
   * Emitted when the value of the textarea changes.
   */
  (e: "update:modelValue", value: string): void;
}>();

defineSlots<{
  /**
   * Slot for customizing how individual rows are rendered by the textarea.
   * By default, it renders them as simple plain text, indistinguishable from
   * a regular text area. You can use the slots to render more advanced markup
   * such as highlighting or inline controls.
   */
  row(props: { row: string; context: RowContext; index: number }): any;
}>();

const textareaEl = ref<null | HTMLTextAreaElement>(null);

/* -------------------------------------------------- *
 * Model value handling                               *
 * -------------------------------------------------- */

function setLocalModelValue(value: string): void {
  const stringValue = Array.isArray(value) ? text.joinLines(value) : value;
  emit("update:modelValue", stringValue);
}

function onInput(event: Event): void {
  if (!(event.target instanceof HTMLTextAreaElement)) return;
  setLocalModelValue(event.target.value);
}

const rows = computed(() => text.splitLines(props.modelValue));

const rowsWithContext = computed(() =>
  rows.value.map((r, i) => ({
    row: r,
    key: `${i}#${r}`,
    context: props.contextProvider(r),
  }))
);

/* -------------------------------------------------- *
 * Autosizing                                         *
 * -------------------------------------------------- */

const editorHeight = ref<string>("auto");

async function determineEditorHeight() {
  editorHeight.value = "auto";
  await nextTick();

  editorHeight.value = textareaEl.value?.scrollHeight
    ? `${textareaEl.value?.scrollHeight}px`
    : "auto";
}

watchEffect(() => {
  if (textareaEl.value) determineEditorHeight();
});

watch(
  () => props.modelValue,
  () => {
    if (textareaEl.value) determineEditorHeight();
  }
);

const overscroll = computed<string | undefined>(() => {
  if (props.scrollBeyondLastLine === true) return "18rem";
  else if (typeof props.scrollBeyondLastLine === "number") {
    return `${props.scrollBeyondLastLine}rem`;
  } else return undefined;
});

/* -------------------------------------------------- *
 * Tab handling                                       *
 * -------------------------------------------------- */

function onInsertTab(event: KeyboardEvent): void {
  const newRows = [...rows.value];
  const mode: text.IndentMode = event.shiftKey ? "outdent" : "indent";

  withContext(({ adjustSelection, selectedLines }) => {
    const [from, to] = selectedLines;

    const toIndent = newRows.slice(from, to + 1);
    const indented = text.indent(toIndent, mode);

    // Nothing to do if nothing has changed
    if (toIndent.every((r, i) => r === indented[i])) return;

    newRows.splice(from, to - from + 1, ...indented);
    setLocalModelValue(text.joinLines(newRows));

    if (from === to) {
      adjustSelection({ to: "relative", delta: mode === "indent" ? 1 : -1 });
    } else {
      adjustSelection({ to: "lines", start: from, end: to });
    }
  });
}

/* -------------------------------------------------- *
 * List continuation                                  *
 * -------------------------------------------------- */

function onContinueList(event: KeyboardEvent): void {
  if (!props.continueLists || !props.continueLists.length) return;

  event.preventDefault();

  const newRows = [...rows.value];
  const rules = props.continueLists ? props.continueLists : [];

  withContext(({ selectionStart, selectedLines, adjustSelection }) => {
    const [lineNr] = selectedLines;
    const cursorInLine = text.getCursorInLine(props.modelValue, selectionStart);

    const continued = text.continueList(newRows[lineNr], rules, cursorInLine);
    newRows.splice(lineNr, 1, continued.current);
    if (continued.next !== null) newRows.splice(lineNr + 1, 0, continued.next);
    setLocalModelValue(text.joinLines(newRows));

    if ("didContinue" in continued && continued.didContinue) {
      adjustSelection({ to: "relative", delta: continued.match.length + 1 });
    } else if ("didEnd" in continued && continued.didEnd) {
      adjustSelection({ to: "startOfLine", startOf: lineNr });
    } else {
      adjustSelection({ to: "relative", delta: 1 });
    }
  });
}

/* -------------------------------------------------- *
 * Flipping lines                                     *
 * -------------------------------------------------- */

function onFlip(direction: "up" | "down"): void {
  const newRows = [...rows.value];

  withContext(({ selectedLines, adjustSelection }) => {
    const [lineNr, endLineNr] = selectedLines;
    const to = direction === "up" ? lineNr - 1 : lineNr + 1;

    if (lineNr !== endLineNr || to < 0 || to >= newRows.length) return;

    const [flippedFrom, flippedTo] = text.flip(newRows[lineNr], newRows[to]);
    newRows[lineNr] = flippedFrom;
    newRows[to] = flippedTo;
    setLocalModelValue(text.joinLines(newRows));

    adjustSelection({ to: "endOfLine", endOf: to });
  });
}

/* -------------------------------------------------- *
 * Cutting and pasting                                *
 * -------------------------------------------------- */

function onCut(event: KeyboardEvent): void {
  withContext(async (ctx) => {
    const [lineNr, endLineNr] = ctx.selectedLines;
    if (lineNr !== endLineNr || ctx.selectionStart !== ctx.selectionEnd) return;

    event.preventDefault();

    await navigator.clipboard.writeText(rows.value[lineNr]);
    const newRows = text.deleteLine(rows.value, lineNr);
    setLocalModelValue(text.joinLines(newRows));

    const newLinNr = Math.min(lineNr, newRows.length - 1);
    ctx.adjustSelection({ to: "endOfLine", endOf: newLinNr });
  });
}

function onDuplicate(event: KeyboardEvent): void {
  withContext(async (ctx) => {
    const [lineNr, endLineNr] = ctx.selectedLines;
    if (lineNr !== endLineNr || ctx.selectionStart !== ctx.selectionEnd) return;

    event.preventDefault();

    const newRows = text.duplicateLine(rows.value, lineNr);
    setLocalModelValue(text.joinLines(newRows));

    ctx.adjustSelection({ to: "endOfLine", endOf: lineNr + 1 });
  });
}

function onDelete(event: KeyboardEvent): void {
  withContext(async (ctx) => {
    const [lineNr, endLineNr] = ctx.selectedLines;
    if (lineNr !== endLineNr || ctx.selectionStart !== ctx.selectionEnd) return;

    event.preventDefault();

    const newRows = text.deleteLine(rows.value, lineNr);
    setLocalModelValue(text.joinLines(newRows));

    const newLinNr = Math.min(lineNr, newRows.length - 1);
    ctx.adjustSelection({ to: "endOfLine", endOf: newLinNr });
  });
}

function onPaste(event: ClipboardEvent): void {
  const payload = event.clipboardData?.getData("text/plain");
  const newRows = [...rows.value];

  withContext(({ selectedLines, adjustSelection }) => {
    if (!payload || !props.continueLists) return;

    const [lineNr, endLineNr] = selectedLines;
    if (lineNr !== endLineNr) return;

    const merge = text.mergeList(newRows[lineNr], payload, props.continueLists);
    if (merge === null) return;

    event.preventDefault();

    newRows[lineNr] = merge.current;
    setLocalModelValue(text.joinLines(newRows));

    adjustSelection({
      to: "relative",
      delta: merge.current.length - merge.match.length,
      collapse: true,
    });
  });
}

/* -------------------------------------------------- *
 * Autocomplete                                       *
 * -------------------------------------------------- */

const acContext = reactive<{
  active: boolean;
  focused: number;
  menuX: string;
  menuY: string;
  mode?: AutoComplete;
  query: string;
  start: number;
}>({
  active: false,
  focused: 0,
  menuX: "0px",
  menuY: "0px",
  mode: undefined,
  query: "",
  start: 0,
});

const menuPositionText = ref<{ before: string; after: string }>();
const menuPositionHelperEl = ref<HTMLElement | null>(null);

async function determineAcMenuPosition(): Promise<{ x: string; y: string }> {
  if (!acContext.active) return { x: "0px", y: "0px" };

  menuPositionText.value = {
    before: props.modelValue.substring(0, acContext.start),
    after: props.modelValue.substring(acContext.start),
  };

  await nextTick();
  const rect = menuPositionHelperEl.value?.getBoundingClientRect();
  menuPositionText.value = undefined;

  return {
    x: rect?.right ? `${rect.right}px` : "0px",
    y: rect?.bottom ? `${rect.bottom}px` : "0px",
  };
}

function onAutocomplete(event: KeyboardEvent) {
  if (!props.autocomplete) return;

  const allowedKeys = [
    "Alt",
    "ArrowDown",
    "ArrowUp",
    "Backspace",
    "Control",
    "Meta",
    "Shift",
  ];

  // No autocomplete context existing yet -> check if we need to create one
  if (!acContext.active) {
    const mode = props.autocomplete.find((i) => i.trigger === event.key);
    if (!mode) return;

    withContext(({ selectionStart }) => {
      acContext.active = true;
      acContext.mode = mode;
      acContext.query = "";
      acContext.start = selectionStart - 1; // Include trigger char

      determineAcMenuPosition().then(({ x, y }) => {
        acContext.menuX = x;
        acContext.menuY = y;
      });
    });
  }

  // Hit enter -> run selected command
  else if (event.key === "Enter") {
    if (!acCommands.value[acContext.focused]) return;
    execAutocomplete(acCommands.value[acContext.focused]);
    event.preventDefault();
  }

  // Autocomplete was interrupted -> reset
  else if (!allowedKeys.includes(event.key) && !event.key.match(/^\w$/)) {
    endAutocomplete();
  }

  // User is typing -> update current command
  else if (acContext.mode) {
    let currentText = props.modelValue.substring(acContext.start);
    const exp = new RegExp(`^\\${acContext.mode.trigger}(\\w*)`);
    const match = currentText.match(exp);

    if (match) acContext.query = match[1];
    else endAutocomplete();
  }
}

const acCommands = computed(() => {
  if (!acContext.mode?.commands) return [];

  const query = acContext.query?.toLowerCase();

  // If the user hasn't entered anything yet, show the initial list
  if (!query) return acContext.mode.commands.filter((i) => i.initial);

  return acContext.mode.commands.filter((i) => {
    const commandStr = i.name.toLowerCase();
    return query && commandStr.includes(query);
  });
});

function acFocusUp(event: KeyboardEvent) {
  if (!acContext.active) return;
  acContext.focused = Math.max(acContext.focused - 1, 0);
  event.preventDefault();
}

function acFocusDown(event: KeyboardEvent) {
  if (!acContext.active) return;
  const next = acContext.focused + 1;
  acContext.focused = Math.min(acCommands.value.length - 1, next);
  event.preventDefault();
}

function execAutocomplete(command: AutoCompleteCommand) {
  // Run and get result
  let result: string | undefined = undefined;
  if (typeof command.value === "function") result = command.value();
  else if (typeof command.value === "string") result = command.value;
  result ??= "";

  // Apply changes
  withContext(({ selectionEnd, adjustSelection }) => {
    const next = text.replaceRange(
      props.modelValue,
      acContext.start,
      selectionEnd + 1,
      result
    );

    setLocalModelValue(next);

    const newStart = acContext.start + result.length;
    adjustSelection({ to: "absolute", start: newStart }, true);
  });

  endAutocomplete();
}

function endAutocomplete() {
  acContext.active = false;
  acContext.focused = 0;
  acContext.menuX = "0px";
  acContext.menuY = "0px";
  acContext.mode = undefined;
  acContext.query = "";
  acContext.start = 0;
}

/* -------------------------------------------------- *
 * Public interface                                   *
 * -------------------------------------------------- */

async function adjustSelection(
  opts: AdjustSelectionOpts,
  tick = true
): Promise<void> {
  if (!textareaEl.value) return;
  const { selectionStart, selectionEnd } = textareaEl.value;
  if (tick) await nextTick();

  // Set the selection to a new range, ignoring the current selection
  if (opts.to === "absolute") {
    textareaEl.value.setSelectionRange(opts.start, opts.end ?? opts.start);
  }

  // Shift the current selection by a delta. If `collapse` is true, the end of
  // the selection will be moved to the start of the selection, even if a range
  // was selected before.
  else if (opts.to === "relative") {
    const start = selectionStart + opts.delta;
    const end = opts.collapse ? start : selectionEnd + opts.delta;
    textareaEl.value.setSelectionRange(start, end);
  }

  // Sets the selection to the start of the specified line
  else if (opts.to === "startOfLine") {
    const [start] = text.getRangeFromSelectedLines(rows.value, opts.startOf);
    textareaEl.value.setSelectionRange(start, start);
  }

  // Sets the selection to the end of the specified line
  else if (opts.to === "endOfLine") {
    const [, end] = text.getRangeFromSelectedLines(rows.value, opts.endOf);
    textareaEl.value.setSelectionRange(end, end);
  }

  // Sets the selection to a range spanning the specified lines
  else if (opts.to === "lines") {
    const [s, e] = text.getRangeFromSelectedLines(
      rows.value,
      opts.start,
      opts.end
    );
    textareaEl.value.setSelectionRange(s, e);
  }
}

function focus(selection?: AdjustSelectionOpts): void {
  textareaEl.value?.focus();
  if (selection) adjustSelection(selection);
}

async function withContext(
  callback: (ctx: EditingContext) => void | Promise<void>,
  options: { ignoreReadonly?: boolean } = { ignoreReadonly: false }
): Promise<void> {
  if (!textareaEl.value || (props.readonly && !options.ignoreReadonly)) return;

  const { selectionStart, selectionEnd } = textareaEl.value;

  await callback({
    adjustSelection,
    focus,
    selectedLines: text.getSelectedLines(
      rows.value,
      selectionStart,
      selectionEnd
    ),
    selectionEnd,
    selectionStart,
  });
}

defineExpose({ withContext });
</script>

<script lang="ts">
import type { Component } from "vue";

export type AdjustSelectionOpts =
  | { to: "absolute"; start: number; end?: number }
  | { to: "relative"; delta: number; collapse?: boolean }
  | { to: "startOfLine"; startOf: number }
  | { to: "endOfLine"; endOf: number }
  | { to: "lines"; start: number; end: number };

export type EditingContext = {
  adjustSelection: (opts: AdjustSelectionOpts, tick?: boolean) => Promise<void>;
  focus: (selection?: AdjustSelectionOpts) => void;
  selectedLines: [from: number, to: number];
  selectionStart: number;
  selectionEnd: number;
};

export type AutoComplete = {
  /** The unique identifier of the autocomplete mode. Can be any string. */
  id: string;

  /**
   * Character that triggers the autocomplete when the user types it. Note that
   * this MUST have a `length` of exactly 1.
   */
  trigger: string;

  /** Commands associated with this autocomplete mode. */
  commands: AutoCompleteCommand[];
};

export type AutoCompleteCommand = {
  /** The unique identifier of the command. Can be any string. */
  id: string;

  /** The visible name of the command. */
  name: string;

  /**
   * Icon of the command. Should be a component, for example an SVG or a
   * function returning some string (e.g. an emoji).
   */
  icon?: Component;

  /**
   * Value of the command. If the value is a string or returns a string,
   * the autocomplete sequence will be replaced by that string. If the
   * value is undefined or returns undefined, the autocomplete sequence
   * will be removed. This can still be useful if you want to run some
   * functionality without inserting any text.
   */
  value: string | (() => string | undefined);

  /**
   * If set to true, the command will be shown by default when the menu is
   * opened, but no query has been entered yet. You can use this to display
   * an initial list of items immediately when the trigger char is typed.
   */
  initial?: boolean;
};
</script>

<template>
  <div
    :class="{ [$style.wrapper]: true, [$style.wrapperReadonly]: readonly }"
    @click="focus()"
  >
    <textarea
      :class="$style.textarea"
      :readonly="readonly"
      :spellcheck="spellcheck"
      :value="props.modelValue"
      @input="onInput"
      @keydown.alt.down.prevent="allowFlipLines ? onFlip('down') : undefined"
      @keydown.alt.up.prevent="allowFlipLines ? onFlip('up') : undefined"
      @keydown.enter="
        acContext.active ? onAutocomplete($event) : onContinueList($event)
      "
      @keydown.meta.shift.d="duplicateLine ? onDuplicate($event) : undefined"
      @keydown.meta.shift.k="deleteLine ? onDelete($event) : undefined"
      @keydown.meta.x="cutFullLine ? onCut($event) : undefined"
      @keydown.tab.prevent="insertTabs ? onInsertTab($event) : undefined"
      @keydown.up="acContext.active ? acFocusUp($event) : undefined"
      @keydown.down="acContext.active ? acFocusDown($event) : undefined"
      @keyup="onAutocomplete($event)"
      @paste="mergeListsOnPaste ? onPaste($event) : undefined"
      ref="textareaEl"
    />

    <div :class="$style.output" data-testid="output">
      <div
        v-for="({ row, key, context }, i) in rowsWithContext"
        :class="$style.row"
        :key="key"
      >
        <slot :row="row" :context="context" :index="i" name="row">
          {{ row }}
        </slot>
      </div>
    </div>

    <div
      v-if="menuPositionText !== undefined"
      :class="$style.menuPositionHelper"
    >
      <span>{{ menuPositionText.before }}</span>
      <span ref="menuPositionHelperEl"></span>
      <span>{{ menuPositionText.after }}</span>
    </div>

    <!-- Autocomplete menu -->
    <menu
      v-if="autocomplete && acContext.active && acCommands.length"
      :class="$style.autocomplete"
      role="menu"
    >
      <li v-for="(command, i) in acCommands" :key="command.id">
        <button
          :data-active="acContext.focused === i ? true : undefined"
          @click="execAutocomplete(command)"
        >
          <component v-if="command.icon" :is="command.icon" />
          {{ command.name }}
        </button>
      </li>
    </menu>
  </div>
</template>

<style module>
/* -------------------------------------------------- *
 * Wrapper                                            *
 * -------------------------------------------------- */

:where(.wrapper) {
  caret-color: blue; /* Need to set a default, otherwise it will be invisible. */
}

.wrapper {
  cursor: text;
  padding-bottom: v-bind(overscroll);
  position: relative;
  tab-size: v-bind(tabSize);
}

.wrapperReadonly {
  cursor: unset;
}

/* -------------------------------------------------- *
 * Textarea                                           *
 * -------------------------------------------------- */

:where(.textarea) {
  all: unset;
  box-sizing: border-box;
}

.textarea,
.output {
  background: inherit;
  font: inherit;
  overflow: hidden;
  white-space: pre-wrap;
}

.textarea {
  caret-color: inherit;
  color: transparent;
  display: block;
  height: v-bind(editorHeight);
  left: 0;
  padding-left: inherit;
  padding-right: inherit;
  position: absolute;
  resize: none;
  right: 0;
}

/* -------------------------------------------------- *
 * Output                                             *
 * -------------------------------------------------- */

.output {
  height: v-bind(editorHeight);
  pointer-events: none;
  position: relative;
}

.output::selection {
  background: transparent;
}

.row {
  min-height: 1lh;
}

/* -------------------------------------------------- *
 * Autocomplete menu                                  *
 * -------------------------------------------------- */

.autocomplete {
  position: fixed;
  top: v-bind("acContext.menuY");
  left: v-bind("acContext.menuX");
}

.menuPositionHelper {
  left: 0;
  position: absolute;
  top: 0;
  white-space: pre-wrap;
}
</style>
