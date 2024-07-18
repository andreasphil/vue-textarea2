import "@testing-library/jest-dom/vitest";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { cleanup, render, screen } from "@testing-library/vue";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { defineComponent, ref } from "vue";
import Textarea2, { AutoComplete } from "./Textarea2.vue";

describe("Textarea2", () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  test("renders", () => {
    render(Textarea2, { props: { modelValue: "" } });

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  describe("model binding", () => {
    test("sets the textarea content based on model value", async () => {
      render(Textarea2, { props: { modelValue: "Foo" } });

      expect(screen.getByRole("textbox")).toHaveValue("Foo");
    });

    test("sets the output content based on model value", async () => {
      render(Textarea2, { props: { modelValue: "Foo" } });

      expect(screen.getByTestId("output")).toHaveTextContent("Foo");
    });

    test("updates the textarea content based on user input", async () => {
      let val = "Foo";

      const { rerender } = render(Textarea2, {
        props: {
          modelValue: val,
          "onUpdate:modelValue": (event: string) => (val = event),
        },
      });

      const el = screen.getByRole("textbox");
      await user.type(el, "b");
      await rerender({ modelValue: val });
      expect(el).toHaveValue("Foob");
    });

    test("updates the output content based on user input", async () => {
      let val = "Foo";

      const { rerender } = render(Textarea2, {
        props: {
          modelValue: val,
          "onUpdate:modelValue": (event: string) => (val = event),
        },
      });

      await user.type(screen.getByRole("textbox"), "b");
      await rerender({ modelValue: val });
      expect(screen.getByTestId("output")).toHaveTextContent("Foob");
    });

    test("emits updated model value on user input", async () => {
      let update = vi.fn();

      render(Textarea2, {
        props: {
          modelValue: "Foo",
          "onUpdate:modelValue": update,
        },
      });

      await user.type(screen.getByRole("textbox"), "b");
      expect(update).toHaveBeenCalledWith("Foob");
    });

    test.todo("does not change on user input when readonly");

    test.todo("does not emit updated model value when readonly");
  });

  describe("row context", () => {
    test("renders the rows as plain text by default", async () => {
      render(Textarea2, { props: { modelValue: "a\nb\nc" } });

      const els = screen.getByTestId("output").children;
      expect(els).toHaveLength(3);
      expect(els[0]).toHaveTextContent("a");
      expect(els[1]).toHaveTextContent("b");
      expect(els[2]).toHaveTextContent("c");
    });

    test("calls a custom context function for each row", async () => {
      const contextProvider = vi.fn();

      render(Textarea2, { props: { modelValue: "a\nb\nc", contextProvider } });

      expect(contextProvider).toHaveBeenCalledWith("a");
      expect(contextProvider).toHaveBeenCalledWith("b");
      expect(contextProvider).toHaveBeenCalledWith("c");
    });

    test("calls the context function again on model changes", async () => {
      const contextProvider = vi.fn();

      const { rerender } = render(Textarea2, {
        props: { modelValue: "a\nb\nc", contextProvider },
      });

      expect(contextProvider).toHaveBeenCalledTimes(3);

      await rerender({ modelValue: "d\ne" });
      expect(contextProvider).toHaveBeenCalledTimes(5);
      expect(contextProvider).toHaveBeenCalledWith("d");
      expect(contextProvider).toHaveBeenCalledWith("e");
    });

    test("provides the output of the context function in the slot", async () => {
      const contextProvider = vi.fn().mockReturnValue({ Foo: "bar" });

      const component = defineComponent({
        // @ts-expect-error Generic component types seem to be wrong
        components: { Textarea2 },
        setup() {
          const model = ref("test");
          return { contextProvider, model };
        },
        template: `
          <Textarea2 v-model="model" :context-provider>
            <template #row="{ context }">
              {{ context.Foo }}
            </template>
          </Textarea2>
        `,
      });

      render(component);

      expect(screen.getByTestId("output")).toHaveTextContent("bar");
    });

    test("provides the text value of the row in the slot", async () => {
      const component = defineComponent({
        // @ts-expect-error Generic component types seem to be wrong
        components: { Textarea2 },
        setup() {
          const model = ref("test");
          return { model };
        },
        template: `
          <Textarea2 v-model="model">
            <template #row="{ row }">
              {{ row }}
            </template>
          </Textarea2>
        `,
      });

      render(component);

      expect(screen.getByTestId("output")).toHaveTextContent("test");
    });

    test("provides the index of the row in the slot", async () => {
      const component = defineComponent({
        // @ts-expect-error Generic component types seem to be wrong
        components: { Textarea2 },
        setup() {
          const model = ref("test");
          return { model };
        },
        template: `
          <Textarea2 v-model="model">
            <template #row="{ index }">
              {{ index }}
            </template>
          </Textarea2>
        `,
      });

      render(component);

      expect(screen.getByTestId("output")).toHaveTextContent("0");
    });
  });

  describe("flipping lines", () => {
    test("moves a line down", async () => {
      const update = vi.fn();
      const modelValue = "a\nb\nc";

      render(Textarea2, {
        props: { modelValue, "onUpdate:modelValue": update },
      });

      await user.type(screen.getByRole("textbox"), "{Alt>}{ArrowDown}{/Alt}", {
        initialSelectionStart: 2,
      });

      expect(update).toHaveBeenCalledWith("a\nc\nb");
    });

    test("moves a line up", async () => {
      const update = vi.fn();
      const modelValue = "a\nb\nc";

      render(Textarea2, {
        props: { modelValue, "onUpdate:modelValue": update },
      });

      await user.type(screen.getByRole("textbox"), "{Alt>}{ArrowUp}{/Alt}", {
        initialSelectionStart: 2,
      });

      expect(update).toHaveBeenCalledWith("b\na\nc");
    });

    test("does not do anything when there is only one line", async () => {
      const update = vi.fn();
      const modelValue = "a";

      render(Textarea2, {
        props: { modelValue, "onUpdate:modelValue": update },
      });

      await user.type(screen.getByRole("textbox"), "{Alt>}{ArrowDown}{/Alt}", {
        initialSelectionStart: 0,
      });

      expect(update).not.toHaveBeenCalled();
    });

    test("does not do anything when going past the last line", async () => {
      const update = vi.fn();
      const modelValue = "a\nb\nc";

      render(Textarea2, {
        props: { modelValue, "onUpdate:modelValue": update },
      });

      await user.type(screen.getByRole("textbox"), "{Alt>}{ArrowDown}{/Alt}", {
        initialSelectionStart: 4,
      });

      expect(update).not.toHaveBeenCalled();
    });

    test("does not do anything when going before the first line", async () => {
      const update = vi.fn();
      const modelValue = "a\nb\nc";

      render(Textarea2, {
        props: { modelValue, "onUpdate:modelValue": update },
      });

      await user.type(screen.getByRole("textbox"), "{Alt>}{ArrowUp}{/Alt}", {
        initialSelectionStart: 0,
      });

      expect(update).not.toHaveBeenCalled();
    });

    test("does not do anything when the behavior is disabled", async () => {
      const update = vi.fn();
      const modelValue = "a\nb\nc";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": update,
          allowFlipLines: false,
        },
      });

      await user.type(screen.getByRole("textbox"), "{Alt>}{ArrowDown}{/Alt}", {
        initialSelectionStart: 2,
      });

      expect(update).not.toHaveBeenCalled();
    });

    test("does not do anything when the component is readonly", async () => {
      const update = vi.fn();
      const modelValue = "a\nb\nc";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": update,
          readonly: true,
        },
      });

      await user.type(screen.getByRole("textbox"), "{Alt>}{ArrowDown}{/Alt}", {
        initialSelectionStart: 2,
      });

      expect(update).not.toHaveBeenCalled();
    });
  });

  describe("continuing lists", () => {
    test("continues dashed lists", async () => {
      let modelValue = "- Item";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(screen.getByRole("textbox"), "{enter}");

      expect(modelValue).toBe("- Item\n- ");
    });

    test("continues bullet lists", async () => {
      let modelValue = "* Item";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(screen.getByRole("textbox"), "{enter}");

      expect(modelValue).toBe("* Item\n* ");
    });

    test("continues numbered lists", async () => {
      let modelValue = "1. Item";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(screen.getByRole("textbox"), "{enter}");

      expect(modelValue).toBe("1. Item\n2. ");
    });

    test("continues indentation with tabs", async () => {
      let modelValue = "\t\tItem";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(screen.getByRole("textbox"), "{enter}");

      expect(modelValue).toBe("\t\tItem\n\t\t");
    });

    test("continues a custom list with the same marker", async () => {
      let modelValue = "> Item";

      render(Textarea2, {
        props: {
          continueLists: [{ pattern: /^> /, next: "same" }],
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(screen.getByRole("textbox"), "{enter}");

      expect(modelValue).toBe("> Item\n> ");
    });

    test("continues a custom list with a dynamic marker", async () => {
      let modelValue = "Foo Item";
      const next = vi.fn().mockReturnValue("Bar ");

      render(Textarea2, {
        props: {
          continueLists: [{ pattern: /^Foo /, next }],
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(screen.getByRole("textbox"), "{enter}");

      expect(modelValue).toBe("Foo Item\nBar ");
      expect(next).toHaveBeenCalled();
    });

    test("ends list continuation on an empty list item", async () => {
      let modelValue = "- ";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(screen.getByRole("textbox"), "{enter}");

      expect(modelValue).toBe("");
    });

    test("does not do anything when the behavior is disabled", async () => {
      let modelValue = "- Item";

      render(Textarea2, {
        props: {
          continueLists: false,
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(screen.getByRole("textbox"), "{enter}");

      expect(modelValue).toBe("- Item\n");
    });
  });

  describe("cutting full lines", () => {
    test("cuts the current line", async () => {
      let modelValue = "a\nb";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      navigator.clipboard.writeText = vi.fn();
      await user.type(screen.getByRole("textbox"), "{meta>}x{/meta}");

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("b");
      expect(modelValue).toBe("a");
    });

    test("does not do anything when the textarea is empty", async () => {
      let modelValue = "";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      navigator.clipboard.writeText = vi.fn();
      await user.type(screen.getByRole("textbox"), "{meta>}x{/meta}");

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("");
      expect(modelValue).toBe("");
    });

    test("does not do anything when something is selected", async () => {
      let modelValue = "a\nb";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      const el = screen.getByRole<HTMLTextAreaElement>("textbox");
      navigator.clipboard.writeText = vi.fn();
      await user.type(el, "{meta>}x{/meta}", {
        initialSelectionStart: 2,
        initialSelectionEnd: 3,
      });

      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    });

    test("does not do anything when the behavior is disabled", async () => {
      let modelValue = "a\nb";

      render(Textarea2, {
        props: {
          cutFullLine: false,
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      navigator.clipboard.writeText = vi.fn();
      await user.type(screen.getByRole("textbox"), "{meta>}x{/meta}");

      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    });

    test("does not do anything when the component is readonly", async () => {
      let modelValue = "a\nb";

      render(Textarea2, {
        props: {
          readonly: true,
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      navigator.clipboard.writeText = vi.fn();
      await user.type(screen.getByRole("textbox"), "{meta>}x{/meta}");

      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
      expect(modelValue).toBe("a\nb");
    });
  });

  describe("deleting lines", () => {
    test("deletes the current line", async () => {
      let modelValue = "a\nb";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(
        screen.getByRole("textbox"),
        "{Meta>}{Shift>}k{/Meta}{/Shift}",
        { initialSelectionStart: 0 }
      );

      expect(modelValue).toBe("b");
    });

    test("does not do anything when the textarea is empty", async () => {
      let modelValue = "";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(
        screen.getByRole("textbox"),
        "{Meta>}{Shift>}k{/Meta}{/Shift}",
        { initialSelectionStart: 0 }
      );

      expect(modelValue).toBe("");
    });

    test("does not do anything when something is selected", async () => {
      let modelValue = "a\nb";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(
        screen.getByRole("textbox"),
        "{Meta>}{Shift>}k{/Meta}{/Shift}",
        { initialSelectionStart: 0, initialSelectionEnd: 1 }
      );

      expect(modelValue).toBe("k\nb");
    });

    test("does not do anything when the behavior is disabled", async () => {
      let modelValue = "a\nb";

      render(Textarea2, {
        props: {
          deleteLine: false,
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(
        screen.getByRole("textbox"),
        "{Meta>}{Shift>}k{/Meta}{/Shift}",
        { initialSelectionStart: 0 }
      );

      expect(modelValue).toBe("ka\nb");
    });

    test("does not do anything when the component is readonly", async () => {
      let modelValue = "a\nb";

      render(Textarea2, {
        props: {
          readonly: true,
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(
        screen.getByRole("textbox"),
        "{Meta>}{Shift>}k{/Meta}{/Shift}",
        { initialSelectionStart: 0 }
      );

      expect(modelValue).toBe("a\nb");
    });
  });

  describe("duplicating lines", () => {
    test("duplicates the current line", async () => {
      let modelValue = "a\nb";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(
        screen.getByRole("textbox"),
        "{Meta>}{Shift>}d{/Meta}{/Shift}",
        { initialSelectionStart: 0 }
      );

      expect(modelValue).toBe("a\na\nb");
    });

    test("does not do anything when something is selected", async () => {
      let modelValue = "a\nb";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(
        screen.getByRole("textbox"),
        "{Meta>}{Shift>}d{/Meta}{/Shift}",
        { initialSelectionStart: 0, initialSelectionEnd: 1 }
      );

      expect(modelValue).toBe("d\nb");
    });

    test("does not do anything when the behavior is disabled", async () => {
      let modelValue = "a\nb";

      render(Textarea2, {
        props: {
          duplicateLine: false,
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(
        screen.getByRole("textbox"),
        "{Meta>}{Shift>}d{/Meta}{/Shift}",
        { initialSelectionStart: 0 }
      );

      expect(modelValue).toBe("da\nb");
    });

    test("does not do anything when the component is readonly", async () => {
      let modelValue = "a\nb";

      render(Textarea2, {
        props: {
          readonly: true,
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(
        screen.getByRole("textbox"),
        "{Meta>}{Shift>}d{/Meta}{/Shift}",
        { initialSelectionStart: 0 }
      );

      expect(modelValue).toBe("a\nb");
    });
  });

  describe("inserting tabs", () => {
    test("indents on tab", async () => {
      let modelValue = "a";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(screen.getByRole("textbox"), "{Tab}", {
        initialSelectionStart: 0,
      });

      expect(modelValue).toBe("\ta");
    });

    test("outdents on shift + tab", async () => {
      let modelValue = "\ta";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(screen.getByRole("textbox"), "{Shift>}{Tab}{/Shift}", {
        initialSelectionStart: 1,
      });

      expect(modelValue).toBe("a");
    });

    test("indents multiple times", async () => {
      let modelValue = "\ta";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(screen.getByRole("textbox"), "{Tab}", {
        initialSelectionStart: 1,
      });

      expect(modelValue).toBe("\t\ta");
    });

    test("does not do anything when trying to outdent without indentation", async () => {
      let modelValue = "a";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(screen.getByRole("textbox"), "{Shift>}{Tab}{/Shift}", {
        initialSelectionStart: 1,
      });

      expect(modelValue).toBe("a");
    });

    test("does not do anything when the behavior is disabled", async () => {
      let modelValue = "\ta";

      render(Textarea2, {
        props: {
          insertTabs: false,
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(screen.getByRole("textbox"), "{Tab}", {
        initialSelectionStart: 1,
      });

      expect(modelValue).toBe("\ta");
    });

    test("does not do anything when the component is readonly", async () => {
      let modelValue = "\ta";

      render(Textarea2, {
        props: {
          readonly: true,
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      await user.type(screen.getByRole("textbox"), "{Shift>}{Tab}{/Shift}", {
        initialSelectionStart: 1,
      });

      expect(modelValue).toBe("\ta");
    });
  });

  describe("merging lists on paste", () => {
    test("merges dashed lists", async () => {
      let modelValue = "- ";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      const el = screen.getByRole("textbox");
      await user.click(el);
      await user.paste("- Item");

      expect(modelValue).toBe("- Item");
    });

    test("marges bullet lists", async () => {
      let modelValue = "* ";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      const el = screen.getByRole("textbox");
      await user.click(el);
      await user.paste("* Item");

      expect(modelValue).toBe("* Item");
    });

    test("merges numbered lists", async () => {
      let modelValue = "1. ";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      const el = screen.getByRole("textbox");
      await user.click(el);
      await user.paste("2. Item");

      expect(modelValue).toBe("2. Item");
    });

    test("merges indentation with tabs", async () => {
      let modelValue = "\t";

      render(Textarea2, {
        props: {
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      const el = screen.getByRole("textbox");
      await user.click(el);
      await user.paste("\tItem");

      expect(modelValue).toBe("\tItem");
    });

    test("merges a custom list with the same marker", async () => {
      let modelValue = "> ";

      render(Textarea2, {
        props: {
          continueLists: [{ pattern: /^> /, next: "same" }],
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      const el = screen.getByRole("textbox");
      await user.click(el);
      await user.paste("> Item");

      expect(modelValue).toBe("> Item");
    });

    test("merges a custom list with a dynamic marker", async () => {
      let modelValue = "Foo ";
      const next = vi.fn().mockReturnValue("Bar ");

      render(Textarea2, {
        props: {
          continueLists: [{ pattern: /^(Foo|Bar) /, next }],
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      const el = screen.getByRole("textbox");
      await user.click(el);
      await user.paste("Bar Item");

      expect(modelValue).toBe("Bar Item");
    });

    test("does not do anything when the behavior is disabled", async () => {
      let modelValue = "- ";

      render(Textarea2, {
        props: {
          mergeListsOnPaste: false,
          modelValue,
          "onUpdate:modelValue": (event: string) => {
            modelValue = event;
          },
        },
      });

      const el = screen.getByRole("textbox");
      await user.click(el);
      await user.paste("- Item");

      expect(modelValue).toBe("- - Item");
    });
  });

  describe("spellchecking", () => {
    test("enables spell checking", () => {
      render(Textarea2, { props: { modelValue: "", spellcheck: true } });
      expect(screen.getByRole("textbox")).toHaveAttribute("spellcheck", "true");
    });

    test("disables spell checking", () => {
      render(Textarea2, { props: { modelValue: "", spellcheck: false } });
      expect(screen.getByRole("textbox")).toHaveAttribute(
        "spellcheck",
        "false"
      );
    });
  });

  describe("autocomplete", () => {
    const example: AutoComplete[] = [
      {
        trigger: "/",
        id: "command",
        commands: [
          { id: "test1", name: "Test", icon: () => "🤔", value: "test" },
          { id: "test2", name: "Example", icon: () => "🫣", value: "example" },
        ],
      },
    ];

    test("shows the menu with commands", async () => {
      const dummy = defineComponent({
        // @ts-expect-error Generic type seems to be broken
        components: { Textarea2 },
        setup() {
          const modelValue = ref("");
          const autocomplete = example;
          return { modelValue, autocomplete };
        },
        template: `
          <Textarea2 v-model="modelValue" :autocomplete />
        `,
      });

      render(dummy);
      await user.type(screen.getByRole("textbox"), "/t");

      expect(screen.getByRole("menu")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "🤔 Test" })
      ).toBeInTheDocument();
    });

    test("doesn't show the menu outside of autocompleting", async () => {
      const dummy = defineComponent({
        // @ts-expect-error Generic type seems to be broken
        components: { Textarea2 },
        setup() {
          const modelValue = ref("");
          const autocomplete = example;
          return { modelValue, autocomplete };
        },
        template: `
          <Textarea2 v-model="modelValue" :autocomplete />
        `,
      });

      render(dummy);

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    test("doesn't show the menu if no commands are found", async () => {
      const dummy = defineComponent({
        // @ts-expect-error Generic type seems to be broken
        components: { Textarea2 },
        setup() {
          const modelValue = ref("");
          const autocomplete = example;
          return { modelValue, autocomplete };
        },
        template: `
          <Textarea2 v-model="modelValue" :autocomplete />
        `,
      });

      render(dummy);
      await user.type(screen.getByRole("textbox"), "/xyz");

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    test("doesn't show the menu if no command has been typed yet", async () => {
      const dummy = defineComponent({
        // @ts-expect-error Generic type seems to be broken
        components: { Textarea2 },
        setup() {
          const modelValue = ref("");
          const autocomplete = example;
          return { modelValue, autocomplete };
        },
        template: `
          <Textarea2 v-model="modelValue" :autocomplete />
        `,
      });

      render(dummy);
      await user.type(screen.getByRole("textbox"), "/");

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    test("marks the first command as focused", async () => {
      const dummy = defineComponent({
        // @ts-expect-error Generic type seems to be broken
        components: { Textarea2 },
        setup() {
          const modelValue = ref("");
          const autocomplete = example;
          return { modelValue, autocomplete };
        },
        template: `
          <Textarea2 v-model="modelValue" :autocomplete />
        `,
      });

      render(dummy);
      await user.type(screen.getByRole("textbox"), "/e");

      const items = screen.getAllByRole("button");
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveAttribute("data-active", "true");
      expect(items[1]).not.toHaveAttribute("data-active");
    });

    test("moves the focus up and down", async () => {
      const dummy = defineComponent({
        // @ts-expect-error Generic type seems to be broken
        components: { Textarea2 },
        setup() {
          const modelValue = ref("");
          const autocomplete = example;
          return { modelValue, autocomplete };
        },
        template: `
          <Textarea2 v-model="modelValue" :autocomplete />
        `,
      });

      render(dummy);
      const textbox = screen.getByRole("textbox");
      await user.type(textbox, "/e");

      const items = screen.getAllByRole("button");
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveAttribute("data-active", "true");
      expect(items[1]).not.toHaveAttribute("data-active");

      await user.type(textbox, "{ArrowDown}");
      expect(items[0]).not.toHaveAttribute("data-active");
      expect(items[1]).toHaveAttribute("data-active", "true");

      await user.type(textbox, "{ArrowUp}");
      expect(items[0]).toHaveAttribute("data-active", "true");
      expect(items[1]).not.toHaveAttribute("data-active");
    });

    test("doesn't move the focus past the last element", async () => {
      const dummy = defineComponent({
        // @ts-expect-error Generic type seems to be broken
        components: { Textarea2 },
        setup() {
          const modelValue = ref("");
          const autocomplete = example;
          return { modelValue, autocomplete };
        },
        template: `
          <Textarea2 v-model="modelValue" :autocomplete />
        `,
      });

      render(dummy);
      const textbox = screen.getByRole("textbox");
      await user.type(textbox, "/e");

      const items = screen.getAllByRole("button");
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveAttribute("data-active", "true");
      expect(items[1]).not.toHaveAttribute("data-active");

      await user.type(textbox, "{ArrowDown}{ArrowDown}");
      expect(items[0]).not.toHaveAttribute("data-active");
      expect(items[1]).toHaveAttribute("data-active", "true");
    });

    test("doesn't move the focus before the first element", async () => {
      const dummy = defineComponent({
        // @ts-expect-error Generic type seems to be broken
        components: { Textarea2 },
        setup() {
          const modelValue = ref("");
          const autocomplete = example;
          return { modelValue, autocomplete };
        },
        template: `
          <Textarea2 v-model="modelValue" :autocomplete />
        `,
      });

      render(dummy);
      const textbox = screen.getByRole("textbox");
      await user.type(textbox, "/e");

      const items = screen.getAllByRole("button");
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveAttribute("data-active", "true");
      expect(items[1]).not.toHaveAttribute("data-active");

      await user.type(textbox, "{ArrowUp}");
      expect(items[0]).toHaveAttribute("data-active", "true");
      expect(items[1]).not.toHaveAttribute("data-active");
    });

    test("hides the menu when the trigger is deleted", async () => {
      const dummy = defineComponent({
        // @ts-expect-error Generic type seems to be broken
        components: { Textarea2 },
        setup() {
          const modelValue = ref("");
          const autocomplete = example;
          return { modelValue, autocomplete };
        },
        template: `
          <Textarea2 v-model="modelValue" :autocomplete />
        `,
      });

      render(dummy);
      const textbox = screen.getByRole("textbox");
      await user.type(textbox, "/t");
      expect(screen.getByRole("menu")).toBeInTheDocument();

      await user.type(textbox, "{Backspace}{Backspace}");
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    test("hides the menu when typing a non-word character", async () => {
      const dummy = defineComponent({
        // @ts-expect-error Generic type seems to be broken
        components: { Textarea2 },
        setup() {
          const modelValue = ref("");
          const autocomplete = example;
          return { modelValue, autocomplete };
        },
        template: `
            <Textarea2 v-model="modelValue" :autocomplete />
          `,
      });

      render(dummy);
      const textbox = screen.getByRole("textbox");
      await user.type(textbox, "/t");
      expect(screen.getByRole("menu")).toBeInTheDocument();

      await user.type(textbox, " ");
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    test("keeps the menu open when pressing modifier keys", async () => {
      const dummy = defineComponent({
        // @ts-expect-error Generic type seems to be broken
        components: { Textarea2 },
        setup() {
          const modelValue = ref("");
          const autocomplete = example;
          return { modelValue, autocomplete };
        },
        template: `
          <Textarea2 v-model="modelValue" :autocomplete />
        `,
      });

      render(dummy);
      const textbox = screen.getByRole("textbox");
      await user.type(textbox, "/t");
      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();

      await user.type(textbox, "{Alt}");
      expect(menu).toBeInTheDocument();

      await user.type(textbox, "{Control}");
      expect(menu).toBeInTheDocument();

      await user.type(textbox, "{Meta}");
      expect(menu).toBeInTheDocument();

      await user.type(textbox, "{Shift}");
      expect(menu).toBeInTheDocument();
    });

    test("replaces the command with a static string", async () => {
      const dummy = defineComponent({
        // @ts-expect-error Generic type seems to be broken
        components: { Textarea2 },
        setup() {
          const modelValue = ref("");
          const autocomplete = example;
          return { modelValue, autocomplete };
        },
        template: `
          <Textarea2 v-model="modelValue" :autocomplete />
        `,
      });

      render(dummy);
      const textbox = screen.getByRole("textbox");
      await user.type(textbox, "Hello /t{Enter}");

      expect(textbox).toHaveValue("Hello test");
    });

    test("replaces the command with a dynamic string", async () => {
      const value = vi.fn().mockReturnValue("foo");

      const dummy = defineComponent({
        // @ts-expect-error Generic type seems to be broken
        components: { Textarea2 },
        setup() {
          const modelValue = ref("");
          const autocomplete = [
            {
              trigger: "/",
              id: "slash",
              commands: [{ id: "test", name: "Test", value }],
            },
          ];
          return { modelValue, autocomplete };
        },
        template: `
          <Textarea2 v-model="modelValue" :autocomplete />
        `,
      });

      render(dummy);
      const textbox = screen.getByRole("textbox");
      await user.type(textbox, "Hello /t{Enter}");

      expect(textbox).toHaveValue("Hello foo");
      expect(value).toHaveBeenCalled();
    });

    test("deletes the command when the value returns undefined", async () => {
      const value = vi.fn().mockReturnValue(undefined);

      const dummy = defineComponent({
        // @ts-expect-error Generic type seems to be broken
        components: { Textarea2 },
        setup() {
          const modelValue = ref("");
          const autocomplete = [
            {
              trigger: "/",
              id: "slash",
              commands: [{ id: "test", name: "Test", value }],
            },
          ];
          return { modelValue, autocomplete };
        },
        template: `
            <Textarea2 v-model="modelValue" :autocomplete />
          `,
      });

      render(dummy);
      const textbox = screen.getByRole("textbox");
      await user.type(textbox, "Hello /t{Enter}");

      expect(textbox).toHaveValue("Hello ");
      expect(value).toHaveBeenCalled();
    });

    test("runs a command on button click", async () => {
      const value = vi.fn().mockReturnValue("foo");

      const dummy = defineComponent({
        // @ts-expect-error Generic type seems to be broken
        components: { Textarea2 },
        setup() {
          const modelValue = ref("");
          const autocomplete = [
            {
              trigger: "/",
              id: "slash",
              commands: [{ id: "test", name: "Test", value }],
            },
          ];
          return { modelValue, autocomplete };
        },
        template: `
          <Textarea2 v-model="modelValue" :autocomplete />
        `,
      });

      render(dummy);
      const textbox = screen.getByRole("textbox");
      await user.type(textbox, "Hello /t");
      await user.click(screen.getByRole("button", { name: "Test" }));

      expect(textbox).toHaveValue("Hello foo");
      expect(value).toHaveBeenCalled();
    });

    test("hides the menu after running a command", async () => {
      const dummy = defineComponent({
        // @ts-expect-error Generic type seems to be broken
        components: { Textarea2 },
        setup() {
          const modelValue = ref("");
          const autocomplete = example;
          return { modelValue, autocomplete };
        },
        template: `
          <Textarea2 v-model="modelValue" :autocomplete />
        `,
      });

      render(dummy);
      const textbox = screen.getByRole("textbox");
      await user.type(textbox, "Hello /t");
      expect(screen.getByRole("menu")).toBeInTheDocument();

      await user.type(textbox, "{Enter}");
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    test("displays the command's name", async () => {
      const dummy = defineComponent({
        // @ts-expect-error Generic type seems to be broken
        components: { Textarea2 },
        setup() {
          const modelValue = ref("");
          const autocomplete = example;
          return { modelValue, autocomplete };
        },
        template: `
          <Textarea2 v-model="modelValue" :autocomplete />
        `,
      });

      render(dummy);
      const textbox = screen.getByRole("textbox");
      await user.type(textbox, "/t");
      expect(screen.getByRole("button", { name: /Test/ })).toBeInTheDocument();
    });

    test("displays the command's icon", async () => {
      const dummy = defineComponent({
        // @ts-expect-error Generic type seems to be broken
        components: { Textarea2 },
        setup() {
          const modelValue = ref("");
          const autocomplete = example;
          return { modelValue, autocomplete };
        },
        template: `
          <Textarea2 v-model="modelValue" :autocomplete />
        `,
      });

      render(dummy);
      const textbox = screen.getByRole("textbox");
      await user.type(textbox, "/t");
      expect(screen.getByRole("button", { name: /🤔/ })).toBeInTheDocument();
    });

    test("filters commands by their names", async () => {
      const dummy = defineComponent({
        // @ts-expect-error Generic type seems to be broken
        components: { Textarea2 },
        setup() {
          const modelValue = ref("");
          const autocomplete = example;
          return { modelValue, autocomplete };
        },
        template: `
          <Textarea2 v-model="modelValue" :autocomplete />
        `,
      });

      render(dummy);
      const textbox = screen.getByRole("textbox");
      await user.type(textbox, "/e");

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);

      await user.type(textbox, "/ex");
      expect(buttons).toHaveLength(2);
    });

    test("filter is not case-sensitive", async () => {
      const dummy = defineComponent({
        // @ts-expect-error Generic type seems to be broken
        components: { Textarea2 },
        setup() {
          const modelValue = ref("");
          const autocomplete = example;
          return { modelValue, autocomplete };
        },
        template: `
          <Textarea2 v-model="modelValue" :autocomplete />
        `,
      });

      render(dummy);
      const textbox = screen.getByRole("textbox");
      await user.type(textbox, "/TEST");
      expect(screen.getByRole("button", { name: /Test/ })).toBeInTheDocument();
    });

    test("shows initial commands when the query is empty", async () => {
      const dummy = defineComponent({
        // @ts-expect-error Generic type seems to be broken
        components: { Textarea2 },
        setup() {
          const modelValue = ref("");
          const autocomplete = [
            {
              trigger: "/",
              id: "slash",
              commands: [
                { id: "init", name: "Initial", value: "foo", initial: true },
              ],
            },
          ];
          return { modelValue, autocomplete };
        },
        template: `
          <Textarea2 v-model="modelValue" :autocomplete />
        `,
      });

      render(dummy);
      const textbox = screen.getByRole("textbox");
      await user.type(textbox, "/");
      expect(
        screen.getByRole("button", { name: "Initial" })
      ).toBeInTheDocument();
    });
  });

  describe.todo("running in component context", () => {
    test.todo("provides the currently selected lines");

    test.todo("provides the selection start");

    test.todo("provides the selection end");

    test.todo("provides the cursor position");

    test.todo("provides a method for adjusting the selection");

    test.todo("adjusts the selection to an absolute position for a range");

    test.todo("adjusts the selection to an absolute position for a point");

    test.todo("adjusts the selection to a relative positive position");

    test.todo("adjusts the selection to a relative negative position");

    test.todo("collapses the selection when adjusting to a relative position");

    test.todo("adjusts the selection to the start of a line");

    test.todo("adjust the selection to the end of a line");

    test.todo("adjusts the selection to span multiple lines");

    test.todo("provides a method for focusing");

    test.todo("focuses the textarea");

    test.todo("sets an initial selection when focusing the textarea");
  });

  describe.todo("autosizing", () => {
    // TODO: Not sure how this would best be tested ...
  });

  describe.todo("tab sizing", () => {
    // TODO: Not sure how this would best be tested ...
  });

  describe.todo("scrolling beyond last line", () => {
    // TODO: Not sure how this would best be tested ...
  });
});
