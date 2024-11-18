"use client";
import { useState, useMemo, useCallback } from "react";

export function useAuthoritativeUpdates({
  serverUpdatedAt,
  startingText,
}: {
  serverUpdatedAt: number;
  startingText: string;
}) {
  const [text, setText] = useState(startingText);
  const [clientDataUpdatedAt, setClientDataUpdatedAt] =
    useState(serverUpdatedAt);
  const [updateMonacoKey, setUpdateMonacoKey] = useState(1);

  // console.log("client is authoritative", clientIsAuthoritative);
  const textUpdate = useCallback((t: string, updateMonaco: boolean = false) => {
    setText(t);
    setClientDataUpdatedAt(Date.now());
    if (updateMonaco) setUpdateMonacoKey((t) => t + 1);
  }, []);

  return useMemo(
    () => ({
      clientIsAuthoritative: serverUpdatedAt <= clientDataUpdatedAt,
      serverUpdatedAt,
      clientDataUpdatedAt,
      textUpdate,
      text,
      monacoKey: updateMonacoKey,
    }),
    [clientDataUpdatedAt, serverUpdatedAt, text, textUpdate, updateMonacoKey]
  );
}
