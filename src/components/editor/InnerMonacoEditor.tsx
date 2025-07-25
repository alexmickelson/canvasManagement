"use client";
import React, { useRef, useEffect } from "react";
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
        console.log("in init", monaco, divRef.current, editorRef.current);
        if (divRef.current && !editorRef.current) {
          const properties: editor.IStandaloneEditorConstructionOptions = {
            value: value,
            language: "markdown",
            tabSize: 3,
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
          editorRef.current.onDidChangeModelContent(() => {
            console.log("in on change", onChange);
            onChange(editorRef.current?.getModel()?.getValue() ?? "");
          });
        } else {
          console.log("second render of init");
        }
      });
    } else if (!divRef.current) {
    }
  }, [onChange, value]);

  return (
    <div
      className="Editor"
      ref={divRef}
      style={{ height: "100%", overflow: "hidden" }}
    ></div>
  );
}
