"use client";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import markedKatex from "marked-katex-extension";
import { LocalCourseSettings } from "@/features/local/course/localCourseSettings";

const mermaidExtension = {
  name: "mermaid",
  level: "block" as const,
  start(src: string) {
    return src.indexOf("```mermaid");
  },
  tokenizer(src: string) {
    const rule = /^```mermaid\n([\s\S]+?)```(?:\n|$)/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: "mermaid",
        raw: match[0],
        text: match[1].trim(),
      };
    }
  },
  renderer(token: { text: string }) {
    const base64 = btoa(token.text);
    const url = `https://mermaid.ink/img/${base64}?type=svg`;
    console.log(token.text, url);
    return `<img src="${url}" alt="Mermaid diagram" />`;
  },
};

marked.use(
  markedKatex({
    throwOnError: false,
    output: "mathml",
  })
);

marked.use({ extensions: [mermaidExtension] });

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
      console.log(
        `No image in settings for ${imageSrc}, do you have NEXT_PUBLIC_ENABLE_FILE_SYNC=true in your settings?`
      );
    }
    // could error check here, but better to just not display an image...
    // if (typeof destinationUrl === "undefined") {
    //   throw `cannot convert to html, no canvas url for ${imageSrc} in settings`;
    // }
    mutableHtml = mutableHtml.replaceAll(imageSrc, destinationUrl);
  }
  return mutableHtml;
}

export function markdownToHTMLSafe({
  markdownString,
  settings,
  convertImages = true,
  replaceText = [],
}: {
  markdownString: string;
  settings: LocalCourseSettings;
  convertImages?: boolean;
  replaceText?: { source: string; destination: string }[];
}) {
  const html = markdownToHtmlNoImages(markdownString);
  const replacedHtml = replaceText.reduce(
    (acc, { source, destination }) => acc.replaceAll(source, destination),
    html
  );

  if (convertImages) return convertImagesToCanvasImages(replacedHtml, settings);
  return replacedHtml;
}

export function markdownToHtmlNoImages(markdownString: string) {
  const clean = DOMPurify.sanitize(
    marked.parse(markdownString, { async: false, pedantic: false, gfm: true })
  ).replaceAll(/>[^<>]*<\/math>/g, "></math>");
  return clean;
}
