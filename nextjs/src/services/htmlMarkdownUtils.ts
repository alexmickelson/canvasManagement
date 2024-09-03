"use client";
import { marked } from "marked";
import * as DOMPurify from "isomorphic-dompurify";

export function markdownToHTMLSafe(markdownString: string) {
  const clean = DOMPurify.sanitize(
    marked.parse(markdownString, { async: false, pedantic: false, gfm: true })
  );
  return clean;
}
