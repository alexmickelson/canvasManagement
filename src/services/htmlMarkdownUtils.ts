"use client";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import { LocalCourseSettings } from "@/models/local/localCourseSettings";
import markedKatex from "marked-katex-extension";
import toast from "react-hot-toast";

marked.use(
  markedKatex({
    throwOnError: false,
    output: "mathml",
  })
);

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
      console.log(`No image in settings for ${imageSrc}, do you have NEXT_PUBLIC_ENABLE_FILE_SYNC=true in your settings?`)
    }
    // could error check here, but better to just not display an image...
    // if (typeof destinationUrl === "undefined") {
    //   throw `cannot convert to html, no canvas url for ${imageSrc} in settings`;
    // }
    mutableHtml = mutableHtml.replaceAll(imageSrc, destinationUrl);
  }
  return mutableHtml;
}

export function markdownToHTMLSafe(
  markdownString: string,
  settings: LocalCourseSettings,
  convertImages: boolean = true
) {
  const html = markdownToHtmlNoImages(markdownString);
  if (convertImages) return convertImagesToCanvasImages(html, settings);
  else return html;
}

export function markdownToHtmlNoImages(markdownString: string) {
  const clean = DOMPurify.sanitize(
    marked.parse(markdownString, { async: false, pedantic: false, gfm: true })
  ).replaceAll(/>[^<>]*<\/math>/g, "></math>");
  return clean;
}
