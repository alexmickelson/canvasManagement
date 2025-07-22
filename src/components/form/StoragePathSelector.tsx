import { useDirectoryContentsQuery } from "@/hooks/localCourse/storageDirectoryHooks";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export function StoragePathSelector({
  startingValue,
  submitValue,
  label,
  className,
}: {
  startingValue: string;
  submitValue: (newValue: string) => void;
  label: string;
  className?: string;
}) {
  const [path, setPath] = useState(startingValue);
  const [lastCorrectPath, setLastCorrectPath] = useState(startingValue);
  const { data: directoryContents } =
    useDirectoryContentsQuery(lastCorrectPath);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [arrowUsed, setArrowUsed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isFocused || filteredFolders.length === 0) return;
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) => (prev + 1) % filteredFolders.length);
      setArrowUsed(true);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex(
        (prev) => (prev - 1 + filteredFolders.length) % filteredFolders.length
      );
      setArrowUsed(true);
      e.preventDefault();
    } else if (e.key === "Tab") {
      if (highlightedIndex >= 0) {
        handleSelectFolder(filteredFolders[highlightedIndex], arrowUsed);
        e.preventDefault();
      } else {
        handleSelectFolder(filteredFolders[1], arrowUsed);
        e.preventDefault();
      }
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0) {
        handleSelectFolder(filteredFolders[highlightedIndex], arrowUsed);
        e.preventDefault();
      } else {
        setIsFocused(false);
        inputRef.current?.blur();
        e.preventDefault();
      }
    } else if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
      e.preventDefault();
    }
  };

  // Calculate dropdown position style
  const dropdownPositionStyle = (() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      return {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      };
    }
    return {};
  })();

  // Get last part of the path
  const lastPart = path.split("/")[path.split("/").length - 1] || "";
  // Filter options to those whose name matches the last part of the path
  const filteredFolders = (directoryContents?.folders ?? []).filter((option) =>
    option.toLowerCase().includes(lastPart.toLowerCase())
  );

  // Handle folder selection
  const handleSelectFolder = (option: string, shouldFocus: boolean = false) => {
    let newPath = path.endsWith("/")
      ? path + option
      : path.replace(/[^/]*$/, option);
    if (!newPath.endsWith("/")) {
      newPath += "/";
    }
    setPath(newPath);
    setLastCorrectPath(newPath);
    setArrowUsed(false);
    setHighlightedIndex(-1);
    if (shouldFocus) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
    submitValue(newPath);
  };

  // Scroll highlighted option into view when it changes
  useEffect(() => {
    if (dropdownRef.current && highlightedIndex >= 0) {
      const optionElements =
        dropdownRef.current.querySelectorAll(".dropdown-option");
      if (optionElements[highlightedIndex]) {
        (optionElements[highlightedIndex] as HTMLElement).scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, [highlightedIndex]);

  return (
    <label className={"flex flex-col relative " + className}>
      {label}
      <br />
      <input
        ref={inputRef}
        className="bg-slate-800 border border-slate-500 rounded-md w-full px-1"
        value={path}
        onChange={(e) => {
          setPath(e.target.value);
          if (e.target.value.endsWith("/")) {
            setLastCorrectPath(e.target.value);
            setTimeout(() => inputRef.current?.focus(), 0);
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 100)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      <div className="text-xs text-slate-400 mt-1">
        Last valid path: {lastCorrectPath}
      </div>
      {isFocused &&
        createPortal(
          <div className=" ">
            <div
              ref={dropdownRef}
              className={
                " text-slate-300  border border-slate-500 " +
                "absolute bg-slate-900 rounded-md mt-1 w-full max-h-96 overflow-y-auto pointer-events-auto"
              }
              style={dropdownPositionStyle}
            >
              {filteredFolders.map((option, idx) => (
                <div
                  key={option}
                  className={`dropdown-option w-full px-2 py-1 cursor-pointer ${
                    highlightedIndex === idx ? "bg-blue-700 text-white" : ""
                  }`}
                  onMouseDown={() => handleSelectFolder(option)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}
    </label>
  );
}
