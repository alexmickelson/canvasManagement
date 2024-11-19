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
  const clientIsAuthoritative = useMemo(() => {
    const authority = serverUpdatedAt <= clientDataUpdatedAt;
    // const authority = serverUpdatedAt <= clientDataUpdatedAt + 500; // if it is close, it might be the second-to-last update changing the first (by file update delays), add some buffer...
    // console.log("client is authoritative", authority);
    return authority;
  }, [clientDataUpdatedAt, serverUpdatedAt]);

  const textUpdate = useCallback((t: string, updateMonaco: boolean = false) => {
    setText(t);
    setClientDataUpdatedAt(Date.now());
    if (updateMonaco) setUpdateMonacoKey((t) => t + 1);
  }, []);

  return useMemo(
    () => ({
      clientIsAuthoritative,
      serverUpdatedAt,
      clientDataUpdatedAt,
      textUpdate,
      text,
      monacoKey: updateMonacoKey,
    }),
    [
      clientDataUpdatedAt,
      clientIsAuthoritative,
      serverUpdatedAt,
      text,
      textUpdate,
      updateMonacoKey,
    ]
  );
}
