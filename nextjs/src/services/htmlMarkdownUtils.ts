"use client";
import { marked } from "marked";
import markedKatex from "marked-katex-extension";
import * as DOMPurify from "isomorphic-dompurify";

export function markdownToHTMLSafe(markdownString: string) {
  const options = {
    throwOnError: false,
    nonStandard: true
  };
  
  marked.use(markedKatex(options));

  const clean = DOMPurify.sanitize(
    marked.parse(markdownString, { async: false, pedantic: false, gfm: true })
  );
  return clean;
}
