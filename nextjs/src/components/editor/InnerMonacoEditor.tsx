"use client";
import React, { useRef, useEffect } from "react";
// import * as monaco from "monaco-editor";
import Editor, { Monaco } from "@monaco-editor/react";
// @ts-ignore
// self.MonacoEnvironment = {
// 	getWorkerUrl: function (_moduleId: any, label: string) {
// 		if (label === 'json') {
// 			return './json.worker.bundle.js';
// 		}
// 		if (label === 'css' || label === 'scss' || label === 'less') {
// 			return './css.worker.bundle.js';
// 		}
// 		if (label === 'html' || label === 'handlebars' || label === 'razor') {
// 			return './html.worker.bundle.js';
// 		}
// 		if (label === 'typescript' || label === 'javascript') {
// 			return './ts.worker.bundle.js';
// 		}
// 		return './editor.worker.bundle.js';
// 	}
// };

export default function InnerMonacoEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  console.log("monaco editor");
 
  const monacoRef = useRef(null);

  function handleEditorWillMount(monaco: Monaco) {
    // here is the monaco instance
    // do something before editor is mounted
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  }

  function handleEditorDidMount(editor: Monaco, monaco: Monaco) {
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage
    monacoRef.current = monaco;
  }
  return (
    // <div
    //   className="Editor"
    //   ref={divEl}
    //   style={{ height: "500px", width: "100%" }}
    // ></div>
    <Editor
      height="90vh"
      defaultLanguage="markdown"
      theme="vs-dark"
      
      defaultValue="// some comment"
      onChange={(value) => console.log(value)}
    />
  );
}
