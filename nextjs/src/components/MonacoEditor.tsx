"use client";
import styles from "./MonacoEditor.module.css";
import Editor from "@monaco-editor/react";

export default function MonacoEditor() {
  return (
    <Editor
    height={"100vh"}
      defaultLanguage="javascript"
      defaultValue="// some comment"
    />
  );
}
