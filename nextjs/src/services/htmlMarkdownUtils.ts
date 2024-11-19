"use client";
import { marked } from "marked";
import * as DOMPurify from "isomorphic-dompurify";
import { LocalCourseSettings } from "@/models/local/localCourseSettings";

function extractImageSources(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const imgElements = doc.querySelectorAll("img");
  const srcUrls = Array.from(imgElements).map((img) => img.src);
  return srcUrls;
}

function handleImages(html: string, settings: LocalCourseSettings) {
  const imageSources = extractImageSources(html);
  console.log(imageSources);
}
export function markdownToHTMLSafe(
  markdownString: string,
  settings: LocalCourseSettings
) {
  const clean = DOMPurify.sanitize(
    marked.parse(markdownString, { async: false, pedantic: false, gfm: true })
  );
  handleImages(clean, settings);
  return clean;
}
