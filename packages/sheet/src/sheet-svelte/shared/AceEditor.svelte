<script lang="ts">
  import { createEventDispatcher, tick, onMount, onDestroy } from "svelte";
  import ace, { Ace } from "ace-builds";
  import "ace-builds/src-noconflict/mode-json";
  import "ace-builds/src-noconflict/theme-chrome";
  import "ace-builds/webpack-resolver";
  let EDITOR: HTMLDivElement | undefined;
  const dispatch = createEventDispatcher<{
    init: Ace.Editor;
    input: string;
    selectionChange: any;
    blur: void;
    changeMode: any;
    commandKey: { err: any; hashId: any; keyCode: any };
    copy: void;
    cursorChange: void;
    cut: void;
    documentChange: { data: any };
    focus: void;
    paste: string;
    save: string;
  }>();

  /**
   * translation of vue component to svelte:
   * @link https://github.com/chairuosen/vue2-ace-editor/blob/91051422b36482eaf94271f1a263afa4b998f099/index.js
   **/
  export let value: string = ""; // String, required
  export let lang: string = "json"; // String
  export let theme: string = "chrome"; // String
  export let height: string = "100%"; // null for 100, else integer, used as percent
  export let width: string = "100%"; // null for 100, else integer, used as percent
  export let options: any = {}; // Object
  export let readonly: boolean = false;

  let editor: Ace.Editor;
  let contentBackup: string = "";

  const requireEditorPlugins = () => {};
  requireEditorPlugins();

  onDestroy(() => {
    if (editor) {
      editor.destroy();
      editor.container.remove();
    }
  });

  $: watchValue(value);
  function watchValue(val: string) {
    if (contentBackup !== val && editor && typeof val === "string") {
      editor.session.setValue(val);
      contentBackup = val;
    }
  }

  $: watchTheme(theme);
  function watchTheme(newTheme: string) {
    if (editor) {
      editor.setTheme("ace/theme/" + newTheme);
    }
  }

  $: watchMode(lang);
  function watchMode(newOption: any) {
    if (editor) {
      editor.getSession().setMode("ace/mode/" + newOption);
    }
  }

  $: watchOptions(options);
  function watchOptions(newOption: any) {
    if (editor) {
      editor.setOptions(newOption);
    }
  }

  $: watchReadOnlyFlag(readonly);
  function watchReadOnlyFlag(flag: boolean) {
    if (editor) {
      editor.setReadOnly(flag);
    }
  }

  const resizeOnNextTick = () =>
    tick().then(() => {
      if (editor) {
        editor.resize();
      }
    });

  $: if (height !== null && width !== null) {
    resizeOnNextTick();
  }

  onMount(() => {
    if (!EDITOR) return;
    lang = lang || "text";
    theme = theme || "chrome";
    editor = ace.edit(EDITOR);
    editor.renderer.attachToShadowRoot();
    dispatch("init", editor);
    //@ts-ignore
    editor.$blockScrolling = Infinity;
    // editor.setOption("enableEmmet", true);
    editor.getSession().setMode("ace/mode/" + lang);
    editor.setTheme("ace/theme/" + theme);
    editor.setValue(value, 1);
    editor.setReadOnly(readonly);
    contentBackup = value;
    setEventCallBacks();
    if (options) {
      editor.setOptions(options);
    }
  });

  const ValidPxDigitsRegEx = /^d*$/;
  function px(n: string): string {
    if (ValidPxDigitsRegEx.test(n)) {
      return n + "px";
    }
    return n;
  }

  function setEventCallBacks() {
    //@ts-ignore
    editor.onBlur = () => dispatch("blur");
    //@ts-ignore
    editor.onChangeMode = (obj) => dispatch("changeMode", obj);
    //@ts-ignore
    editor.onCommandKey = (err, hashId, keyCode) =>
      dispatch("commandKey", { err, hashId, keyCode });
    //@ts-ignore
    editor.onCopy = () => dispatch("copy");
    //@ts-ignore
    editor.onCursorChange = () => dispatch("cursorChange");
    //@ts-ignore
    editor.onCut = () => {
      const copyText = editor.getCopyText();
      console.log("cut event : ", copyText);
      editor.insert("");
      dispatch("cut");
    };
    //@ts-ignore
    editor.onDocumentChange = (obj: { data: any }) =>
      dispatch("documentChange", obj);
    //@ts-ignore
    editor.onFocus = () => dispatch("focus");
    //@ts-ignore
    editor.onPaste = (text) => {
      console.log("paste event : ", text);
      editor.insert(text);
      dispatch("paste", text);
    };
    //@ts-ignore
    editor.onSelectionChange = (obj) => dispatch("selectionChange", obj);
    editor.on("change", function () {
      const content = editor.getValue();
      value = content;
      dispatch("input", content);
      contentBackup = content;
    });
  }
  function save() {
    dispatch("save", value);
  }
</script>

<div style="width:{px(width)};height:{px(height)}">
  <menu>
    <button on:click="{save}">Save</button>
  </menu>
  <div bind:this="{EDITOR}" style="width:{px(width)};height:{px(height)}"></div>
</div>

<style lang="postcss">
</style>
