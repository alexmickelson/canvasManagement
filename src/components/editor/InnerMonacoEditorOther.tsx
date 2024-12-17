"use client";
import React, { useRef } from "react";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";

import Editor from "@monaco-editor/react";

export default function InnerMonacoEditorOther({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void; // must be memoized
}) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  function handleEditorDidMount(editor: editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
    editor.onDidChangeModelContent((e) => {
      onChange(editorRef.current?.getModel()?.getValue() ?? "");
    });
  }

  return (
    <>
      <Editor
        height="100%"
        options={{
          value: value,
          tabSize: 3,
          minimap: {
            enabled: false,
          },
          lineNumbers: "off",
          wordWrap: "on",
          automaticLayout: true,
          fontFamily: "Roboto-mono",
          fontSize: 16,
          padding: {
            top: 10,
          },
        }}
        defaultLanguage="markdown"
        theme="vs-dark"
        defaultValue={value}
        onMount={handleEditorDidMount}
      />
    </>
  );
}
