import { useState, useRef, useCallback } from "react";

export const useTooltip = (delayMs: number = 150) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const targetRef = useRef<HTMLAnchorElement>(null);

  const showTooltip = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, delayMs);
  }, [delayMs]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  }, []);

  return {
    visible,
    targetRef,
    showTooltip,
    hideTooltip,
  };
};
