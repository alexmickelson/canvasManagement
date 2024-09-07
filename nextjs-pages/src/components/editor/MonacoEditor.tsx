"use client";
import dynamic from "next/dynamic";

const InnerMonacoEditor = dynamic(() => import("./InnerMonacoEditor"), {
  ssr: false,
});

export const MonacoEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  return <InnerMonacoEditor value={value} onChange={onChange} />;
};
