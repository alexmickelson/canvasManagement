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
    // const authority = serverUpdatedAt <= clientDataUpdatedAt;
    const estimatedNetworkRoundTrip = 500; // network latency means client is still authoritative for a slight delay
    const authority =
      serverUpdatedAt <= clientDataUpdatedAt + estimatedNetworkRoundTrip;
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
