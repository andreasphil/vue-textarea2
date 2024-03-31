/** Splits a string into a list of lines. */
export declare function splitLines(text: string): string[];
/** Joins a list of lines into a single string. */
export declare function joinLines(lines: string[]): string;
/** Splits a string in two at the specified index. */
export declare function splitAt(text: string, index: number): [string, string];
/**
 * For a selection beginning at `from` and ending at `to`, returns the line
 * numbers of the first and last selected line.
 *
 * TODO: Only accept string values
 *
 * @param from The start of the selection
 * @param to The end of the selection
 * @param value The value containing the selection
 */
export declare function getSelectedLines(value: string | string[], from: number, to?: number): [number, number];
/**
 * For a selection beginning at `from` and ending at `to`, extends the selection
 * to include the entire lines of the first and last selected line.
 *
 * TODO: Only accept string values
 *
 * @param from The start of the selection
 * @param to The end of the selection
 * @param value The value containing the selection
 */
export declare function getRangeFromSelectedLines(value: string | string[], from: number, to?: number): [number, number];
/**
 * For a cursor (e.g. selectionStart in a textarea) in a value, returns the
 * position of the cursor relative to the line it is on.
 *
 * @param value The value containing the cursor
 * @param cursor The position of the cursor
 */
export declare function getCursorInLine(value: string, cursor: number): number | undefined;
/** Defines conditions under which lists are continued. */
export type ContinueListRule = {
    /** List marker */
    pattern: RegExp;
    /**
     * What to continue the list with. `same` will use the match as is, otherwise
     * a function can be given to generate the continuation text based on the
     * match.
     */
    next: "same" | ((match: string) => string);
};
export type ContinueListResult = {
    /** Updated input line, might have been split if a cursor was given */
    current: string;
} & ({
    /** Newly created line */
    next: string;
    /** List marker as returned by the matching rule */
    match: string;
    /** Indicates that a rule has matched */
    didContinue: true;
} | {
    /**
     * No next line if the list has ended. Set to null for differentiating
     * it from lines that just happen to be empty.
     */
    next: null;
    /** List marker as returned by the matching rule */
    match: string;
    /** Indicates that a rule has matched but the list has ended */
    didEnd: true;
} | {
    /** Newly created line */
    next: string;
    /** Indicates that no rule has matched */
    didContinue: false;
    /** Since no rule has matched, no list has ended either */
    didEnd: false;
});
/** Default rules for list continuation. */
export declare const continueListRules: Record<string, ContinueListRule>;
/**
 * Given a line and a list of rules, checks if the line is a list as defined by
 * one of the rules. If so, it continues the list on the next line, otherwise
 * an empty next line is returned. If a cursor is given, the line is split at
 * the cursor and the continuation text is inserted between the two parts.
 *
 * @param line The line to check
 * @param rules The rules to check against
 * @param cursor The cursor position to split the line at, defaults to end of line
 */
export declare function continueList(line: string, rules: ContinueListRule[], cursor?: number): ContinueListResult;
export type MergeListResult = {
    /** Updated input line */
    current: string;
    /** List marker as returned by the matching rule */
    match: string;
};
/**
 * Given some already existing line, a string of text that should be inserted
 * in that line, and a list of rules for continuing lists, this function checks
 * if: 1) the existing line is a list; and 2) the new text is also a list. If
 * both are true, both will be consolidated in order to avoid duplicate list
 * markers.
 *
 * @param line Existing line
 * @param insert Newly inserted content
 * @param rules The rules to check against
 */
export declare function mergeList(line: string, insert: string, rules: ContinueListRule[]): MergeListResult | null;
export type IndentMode = "indent" | "outdent";
/**
 * Indents or outdents a list of lines.
 *
 * @param lines The lines to indent or outdent
 * @param [mode="indent"] Whether to indent or outdent
 */
export declare function indent(lines: string[], mode?: IndentMode): string[];
/**
 * Changes the order of two lines of text.
 *
 * @param a First line
 * @param b Second line
 */
export declare function flip(a: string, b: string): [string, string];
