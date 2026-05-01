import { t as ClientOnly } from "./ClientOnly-BaIsMvon.js";
import { useRef } from "react";
import { Fragment as Fragment$1, jsx } from "react/jsx-runtime";
import Editor from "@monaco-editor/react";
//#region src/components/editor/InnerMonacoEditorOther.tsx
function InnerMonacoEditorOther({ value, onChange }) {
	const editorRef = useRef(null);
	function handleEditorDidMount(editor) {
		editorRef.current = editor;
		editor.onDidChangeModelContent(() => {
			onChange(editorRef.current?.getModel()?.getValue() ?? "");
		});
	}
	return /* @__PURE__ */ jsx(Fragment$1, { children: /* @__PURE__ */ jsx(ClientOnly, { children: /* @__PURE__ */ jsx(Editor, {
		height: "100%",
		options: {
			value,
			tabSize: 3,
			minimap: { enabled: false },
			lineNumbers: "off",
			wordWrap: "on",
			automaticLayout: true,
			fontFamily: "Roboto-mono",
			fontSize: 16,
			padding: { top: 10 }
		},
		defaultLanguage: "markdown",
		theme: "vs-dark",
		defaultValue: value,
		onMount: handleEditorDidMount
	}) }) });
}
//#endregion
export { InnerMonacoEditorOther as default };
