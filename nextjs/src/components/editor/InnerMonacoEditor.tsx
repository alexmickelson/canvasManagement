"use client";
import React, { useRef, useEffect } from "react";
import loader from "@monaco-editor/loader";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
// import * as monaco from "monaco-editor";

// import * as editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
// import * as jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
// import * as cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
// import * as htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
// import * as tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

// self.MonacoEnvironment = {
//   getWorker(_, label) {
//     if (label === 'json') {
//       return new jsonWorker();
//     }
//     if (label === 'css' || label === 'scss' || label === 'less') {
//       return new cssWorker();
//     }
//     if (label === 'html' || label === 'handlebars' || label === 'razor') {
//       return new htmlWorker();
//     }
//     if (label === 'typescript' || label === 'javascript') {
//       return new tsWorker();
//     }
//     return new editorWorker();
//   },
// };

// loader.config({ monaco });

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
          editorRef.current.onDidChangeModelContent((e) => {
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
