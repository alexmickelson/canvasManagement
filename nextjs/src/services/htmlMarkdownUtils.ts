"use client";
import { marked } from "marked";
import * as DOMPurify from "isomorphic-dompurify";
import { LocalCourseSettings } from "@/models/local/localCourseSettings";

export function extractImageSources(htmlString: string) {
  const srcUrls = [];
  const regex = /<img[^>]+src=["']?([^"'>]+)["']?/g;
  let match;

  while ((match = regex.exec(htmlString)) !== null) {
    srcUrls.push(match[1]);
  }

  return srcUrls;
}
export function convertImagesToCanvasImages(
  html: string,
  settings: LocalCourseSettings
) {
  const imageSources = extractImageSources(html);
  let mutableHtml = html;
  // console.log(imageSources);

  const imageLookup = settings.assets.reduce((acc, asset) => {
    return { ...acc, [asset.sourceUrl]: asset.canvasUrl };
  }, {} as { [key: string]: string });

  for (const imageSrc of imageSources) {
    const destinationUrl = imageLookup[imageSrc];
    if (typeof destinationUrl === "undefined") {
      throw `cannot convert to html, no canvas url for  ${imageSrc} in settings`;
    }
    mutableHtml = mutableHtml.replaceAll(imageSrc, destinationUrl);
  }
  // console.log(imageSources, imageLookup, mutableHtml);
  return mutableHtml;
}

export function markdownToHTMLSafe(
  markdownString: string,
  settings: LocalCourseSettings
) {
  const clean = DOMPurify.sanitize(
    marked.parse(markdownString, { async: false, pedantic: false, gfm: true })
  );
  return convertImagesToCanvasImages(clean, settings);
  // return clean;
}

export function markdownToHtmlNoImages(markdownString: string) {
  const clean = DOMPurify.sanitize(
    marked.parse(markdownString, { async: false, pedantic: false, gfm: true })
  );
  return clean;
}
