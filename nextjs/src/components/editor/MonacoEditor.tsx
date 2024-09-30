"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "./MonacoEditor.css";

const InnerMonacoEditor = dynamic(() => import("./InnerMonacoEditorOther"), {
  ssr: false,
});

export const MonacoEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [salt, setSalt] = useState(Date.now());
  useEffect(() => {
    console.log("onchange changed");
    setSalt(Date.now());
  }, [onChange]);
  return <InnerMonacoEditor key={salt} value={value} onChange={onChange} />;
};
