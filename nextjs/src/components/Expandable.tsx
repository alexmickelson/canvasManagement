"use client";
import { ReactNode, Dispatch, SetStateAction, useState, useRef } from "react";

export function Expandable({
  children,
  ExpandableElement,
  defaultExpanded = false,
}: {
  children: ReactNode;
  ExpandableElement: (props: {
    setIsExpanded: Dispatch<SetStateAction<boolean>>;
    isExpanded: boolean;
  }) => ReactNode;
  defaultExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const expandRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <ExpandableElement
        setIsExpanded={setIsExpanded}
        isExpanded={isExpanded}
      />
      <div
        ref={expandRef}
        className={` overflow-hidden transition-all `}
        style={{
          maxHeight: isExpanded ? expandRef?.current?.scrollHeight : "0",
        }}
      >
        {children}
      </div>
    </>
  );
}
