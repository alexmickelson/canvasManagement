"use client";
import { marked, MarkedExtension } from "marked";
import DOMPurify from "isomorphic-dompurify";
import { LocalCourseSettings } from "@/models/local/localCourseSettings";
import markedKatex from "marked-katex-extension";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";

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
    const url = `https://mermaid.ink/img/${base64}?type=svg`
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

// Configure syntax highlighting for code blocks
marked.use({
  renderer: {
    code(token: any) {
      const code = token.text;
      const language = token.lang || '';
      
      if (language && Prism.languages[language]) {
        try {
          const highlighted = Prism.highlight(code, Prism.languages[language], language);
          return `<pre class="language-${language}"><code class="language-${language}">${highlighted}</code></pre>`;
        } catch (error) {
          console.warn(`Syntax highlighting failed for language: ${language}`, error);
          // Fallback to plain code block with escaped HTML
          const escapedCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          return `<pre><code>${escapedCode}</code></pre>`;
        }
      }
      
      // Fallback to plain code block with escaped HTML
      const escapedCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<pre><code>${escapedCode}</code></pre>`;
    }
  }
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
