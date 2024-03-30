import * as text from "@/lib/text";
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
declare const _default: <RowContext extends Record<string, any>>(__VLS_props: {
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    allowFlipLines?: boolean | undefined;
    contextProvider?: ((row: string) => RowContext) | undefined;
    continueLists?: false | text.ContinueListRule[] | undefined;
    cutFullLine?: boolean | undefined;
    insertTabs?: boolean | undefined;
    mergeListsOnPaste?: boolean | undefined;
    modelValue: string;
    readonly?: boolean | undefined;
    scrollBeyondLastLine?: number | boolean | undefined;
    spellcheck?: boolean | undefined;
    tabSize?: number | undefined;
} & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, __VLS_ctx?: {
    attrs: any;
    emit: (e: "update:modelValue", value: string) => void;
    slots: Readonly<{
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
    };
} | undefined, __VLS_expose?: ((exposed: import("vue").ShallowUnwrapRef<{
    withContext: (callback: (ctx: EditingContext) => void | Promise<void>, options?: {
        ignoreReadonly?: boolean;
    }) => Promise<void>;
}>) => void) | undefined, __VLS_setup?: Promise<{
    props: {
        "onUpdate:modelValue"?: ((value: string) => any) | undefined;
        allowFlipLines?: boolean | undefined;
        contextProvider?: ((row: string) => RowContext) | undefined;
        continueLists?: false | text.ContinueListRule[] | undefined;
        cutFullLine?: boolean | undefined;
        insertTabs?: boolean | undefined;
        mergeListsOnPaste?: boolean | undefined;
        modelValue: string;
        readonly?: boolean | undefined;
        scrollBeyondLastLine?: number | boolean | undefined;
        spellcheck?: boolean | undefined;
        tabSize?: number | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{
        withContext: (callback: (ctx: EditingContext) => void | Promise<void>, options?: {
            ignoreReadonly?: boolean;
        }) => Promise<void>;
    }>): void;
    attrs: any;
    slots: Readonly<{
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
    };
    emit: (e: "update:modelValue", value: string) => void;
}>) => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}> & {
    __ctx?: {
        props: {
            "onUpdate:modelValue"?: ((value: string) => any) | undefined;
            allowFlipLines?: boolean | undefined;
            contextProvider?: ((row: string) => RowContext) | undefined;
            continueLists?: false | text.ContinueListRule[] | undefined;
            cutFullLine?: boolean | undefined;
            insertTabs?: boolean | undefined;
            mergeListsOnPaste?: boolean | undefined;
            modelValue: string;
            readonly?: boolean | undefined;
            scrollBeyondLastLine?: number | boolean | undefined;
            spellcheck?: boolean | undefined;
            tabSize?: number | undefined;
        } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps;
        expose(exposed: import("vue").ShallowUnwrapRef<{
            withContext: (callback: (ctx: EditingContext) => void | Promise<void>, options?: {
                ignoreReadonly?: boolean;
            }) => Promise<void>;
        }>): void;
        attrs: any;
        slots: Readonly<{
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
        };
        emit: (e: "update:modelValue", value: string) => void;
    } | undefined;
};
export default _default;
type __VLS_OmitKeepDiscriminatedUnion<T, K extends keyof any> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
