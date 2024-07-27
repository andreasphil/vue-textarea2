import * as text from "@/lib/text";
import type { Component } from "vue";
export type AdjustSelectionOpts = {
    to: "absolute";
    start: number;
    end?: number;
} | {
    to: "relative";
    delta: number;
    collapse?: boolean;
} | {
    to: "startOfLine";
    startOf: number;
} | {
    to: "endOfLine";
    endOf: number;
} | {
    to: "lines";
    start: number;
    end: number;
};
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
declare const _default: <RowContext extends Record<string, any>>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_Prettify<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_Prettify<Pick<Partial<{}> & Omit<{
        "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Readonly<import("vue").ExtractPropTypes<{}>> & {
        "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    }, never>, "onUpdate:modelValue"> & {
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
        contextProvider?: (row: string) => RowContext;
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
    }> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{
        withContext: (callback: (ctx: EditingContext) => void | Promise<void>, options?: {
            ignoreReadonly?: boolean;
        }) => Promise<void>;
    }>): void;
    attrs: any;
    slots: ReturnType<() => Readonly<{
        /**
         * Slot for customizing how individual rows are rendered by the textarea.
         * By default, it renders them as simple plain text, indistinguishable from
         * a regular text area. You can use the slots to render more advanced markup
         * such as highlighting or inline controls.
         */
        row(props: {
            row: string;
            context: RowContext;
            index: number;
        }): any;
    }> & {
        /**
         * Slot for customizing how individual rows are rendered by the textarea.
         * By default, it renders them as simple plain text, indistinguishable from
         * a regular text area. You can use the slots to render more advanced markup
         * such as highlighting or inline controls.
         */
        row(props: {
            row: string;
            context: RowContext;
            index: number;
        }): any;
    }>;
    emit: ((e: "update:modelValue", value: string) => void) & {};
}>) => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}> & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;

type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
