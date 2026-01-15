"use client";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import markedKatex from "marked-katex-extension";
import pako from "pako";
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
    const data = JSON.stringify({
      code: token.text,
      mermaid: { theme: "default" },
    });
    const compressed = pako.deflate(data, { level: 9 });
    const binaryString = Array.from(compressed, (byte) =>
      String.fromCharCode(byte)
    ).join("");
    const base64 = btoa(binaryString).replace(/\+/g, "-").replace(/\//g, "_");
    const url = `https://mermaid.ink/img/pako:${base64}?type=svg`;
    // console.log(token.text, url);
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

// We use a custom renderer instead of a regex replace because regex is too aggressive.
// It would add scope="col" to raw HTML tables (which we want to leave alone).
// The renderer only applies to markdown tables.
marked.use({
  renderer: {
    tablecell(token) {
      const content = this.parser.parseInline(token.tokens);
      const { header, align } = token;
      const type = header ? "th" : "td";
      const alignAttr = align ? ` align="${align}"` : "";
      const scopeAttr = header ? ' scope="col"' : "";
      return `<${type}${scopeAttr}${alignAttr}>${content}</${type}>\n`;
    },
  },
});


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
    if (imageSrc.startsWith("http://") || imageSrc.startsWith("https://"))
      continue;
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
  replaceText?: { source: string; destination: string; strict?: boolean }[];
}) {
  const html = markdownToHtmlNoImages(markdownString);
  const replacedHtml = replaceText.reduce(
    (acc, { source, destination, strict = false }) => {
      if (strict && acc.includes(source)) {
        if (typeof destination === "undefined" || destination === null) {
          throw new Error(
            `Text replacement failed: destination is undefined for source "${source}"`
          );
        }
        if (destination === "") {
          throw new Error(
            `Text replacement failed: destination is empty string for source "${source}"`
          );
        }
      }
      return acc.replaceAll(source, destination);
    },
    html
  );

  if (convertImages) return convertImagesToCanvasImages(replacedHtml, settings);
  return replacedHtml;
}

export function markdownToHtmlNoImages(markdownString: string) {
  const parsedHtml = marked.parse(markdownString, {
    async: false,
    pedantic: false,
    gfm: true,
  }) as string;

  // Move caption inside table
  const htmlWithCaptionInTable = parsedHtml.replace(
    /(<caption[^>]*>[\s\S]*?<\/caption>)\s*(<table[^>]*>)/g,
    "$2$1"
  );

  const clean = DOMPurify.sanitize(htmlWithCaptionInTable).replaceAll(
    />[^<>]*<\/math>/g,
    "></math>"
  );
  return clean;
}
