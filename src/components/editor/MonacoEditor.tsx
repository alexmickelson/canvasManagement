import { lazy, Suspense, useEffect, useState } from "react";
import "./MonacoEditor.css";

const InnerMonacoEditor = lazy(() => import("./InnerMonacoEditorOther"));

export const MonacoEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [salt, setSalt] = useState(Date.now());
  useEffect(() => {
    setSalt(Date.now());
  }, [onChange]);
  return (
    <Suspense fallback={null}>
      <InnerMonacoEditor key={salt} value={value} onChange={onChange} />
    </Suspense>
  );
};
