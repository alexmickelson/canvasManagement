"use client";
import React, { useRef, useEffect } from "react";
// import * as monaco from "monaco-editor";
import Editor, { Monaco } from "@monaco-editor/react";
import loader from "@monaco-editor/loader";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";

export default function InnerMonacoEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void; // must be memoized
}) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current && !editorRef.current) {
      loader.init().then((monaco) => {
        if (divRef.current && !editorRef.current) {
          const properties: editor.IStandaloneEditorConstructionOptions = {
            value: value,
            language: "markdown",
            tabSize: 2,
            theme: "vs-dark",
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
          };

          editorRef.current = monaco.editor.create(divRef.current, properties);
          editorRef.current.onDidChangeModelContent((e) => {
            onChange(editorRef.current?.getModel()?.getValue() ?? "");
          });
        }
      });
    }
  }, [onChange, value]);

  return (
    <div
      id="myMonacoEditor"
      className="Editor"
      ref={divRef}
      style={{ height: "100%", overflow: "hidden" }}
    ></div>
  );
}
