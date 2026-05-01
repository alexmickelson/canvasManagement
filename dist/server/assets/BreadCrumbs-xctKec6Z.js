import { t as SuspenseAndErrorHandling } from "./SuspenseAndErrorHandling-DsJy7QvV.js";
import { n as useLocalCourseSettingsQuery } from "./localCoursesHooks-CLeCOGR6.js";
import "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { marked } from "marked";
import DOMPurify from "dompurify";
import markedKatex from "marked-katex-extension";
import pako from "pako";
//#region src/services/htmlMarkdownUtils.ts
var mermaidExtension = {
	name: "mermaid",
	level: "block",
	start(src) {
		return src.indexOf("```mermaid");
	},
	tokenizer(src) {
		const match = /^```mermaid\n([\s\S]+?)```(?:\n|$)/.exec(src);
		if (match) return {
			type: "mermaid",
			raw: match[0],
			text: match[1].trim()
		};
	},
	renderer(token) {
		const data = JSON.stringify({
			code: token.text,
			mermaid: { theme: "default" }
		});
		const compressed = pako.deflate(data, { level: 9 });
		const binaryString = Array.from(compressed, (byte) => String.fromCharCode(byte)).join("");
		return `<img src="${`https://mermaid.ink/img/pako:${btoa(binaryString).replace(/\+/g, "-").replace(/\//g, "_")}?type=svg`}" alt="Mermaid diagram" />`;
	}
};
marked.use(markedKatex({
	throwOnError: false,
	output: "mathml",
	nonStandard: true
}));
marked.use({ extensions: [mermaidExtension] });
marked.use({ renderer: { tablecell(token) {
	const content = this.parser.parseInline(token.tokens);
	const { header, align } = token;
	const type = header ? "th" : "td";
	const alignAttr = align ? ` align="${align}"` : "";
	return `<${type}${header ? " scope=\"col\"" : ""}${alignAttr}>${content}</${type}>\n`;
} } });
function extractImageSources(htmlString) {
	const srcUrls = [];
	const regex = /<img[^>]+src=["']?([^"'>]+)["']?/g;
	let match;
	while ((match = regex.exec(htmlString)) !== null) srcUrls.push(match[1]);
	return srcUrls;
}
function convertImagesToCanvasImages(html, settings) {
	const imageSources = extractImageSources(html);
	let mutableHtml = html;
	const imageLookup = settings.assets.reduce((acc, asset) => {
		return {
			...acc,
			[asset.sourceUrl]: asset.canvasUrl
		};
	}, {});
	for (const imageSrc of imageSources) {
		if (imageSrc.startsWith("http://") || imageSrc.startsWith("https://")) continue;
		const destinationUrl = imageLookup[imageSrc];
		if (typeof destinationUrl === "undefined") console.log(`No image in settings for ${imageSrc}, do you have NEXT_PUBLIC_ENABLE_FILE_SYNC=true in your settings?`);
		mutableHtml = mutableHtml.replaceAll(imageSrc, destinationUrl);
	}
	return mutableHtml;
}
function markdownToHTMLSafe({ markdownString, settings, convertImages = true, replaceText = [] }) {
	const html = markdownToHtmlNoImages(markdownString);
	const replacedHtml = replaceText.reduce((acc, { source, destination, strict = false }) => {
		if (strict && acc.includes(source)) {
			if (typeof destination === "undefined" || destination === null) throw new Error(`Text replacement failed: destination is undefined for source "${source}"`);
			if (destination === "") throw new Error(`Text replacement failed: destination is empty string for source "${source}"`);
		}
		return acc.replaceAll(source, destination);
	}, html);
	if (convertImages) return convertImagesToCanvasImages(replacedHtml, settings);
	return replacedHtml;
}
function markdownToHtmlNoImages(markdownString) {
	const htmlWithCaptionInTable = marked.parse(markdownString, {
		async: false,
		pedantic: false,
		gfm: true
	}).replace(/(<caption[^>]*>[\s\S]*?<\/caption>)\s*(<table[^>]*>)/g, "$2$1");
	return DOMPurify.sanitize(htmlWithCaptionInTable).replaceAll(/>[^<>]*<\/math>/g, "></math>");
}
//#endregion
//#region src/components/MarkdownDisplay.tsx
function MarkdownDisplay({ markdown, className = "", replaceText = [], convertImages }) {
	const { data: settings } = useLocalCourseSettingsQuery();
	return /* @__PURE__ */ jsx(SuspenseAndErrorHandling, { children: /* @__PURE__ */ jsx(DangerousInnerMarkdown, {
		markdown,
		settings,
		className,
		replaceText,
		convertImages
	}) });
}
function DangerousInnerMarkdown({ markdown, settings, className, replaceText, convertImages }) {
	return /* @__PURE__ */ jsx("div", {
		className: "markdownPreview " + className,
		dangerouslySetInnerHTML: { __html: markdownToHTMLSafe({
			markdownString: markdown,
			convertImages,
			settings,
			replaceText
		}) }
	});
}
//#endregion
//#region src/components/icons/HomeIcon.tsx
function HomeIcon() {
	return /* @__PURE__ */ jsxs("svg", {
		viewBox: "0 0 24 24",
		fill: "currentColor",
		xmlns: "http://www.w3.org/2000/svg",
		className: "h-4 w-4",
		children: [
			/* @__PURE__ */ jsx("g", {
				id: "SVGRepo_bgCarrier",
				strokeWidth: "0"
			}),
			/* @__PURE__ */ jsx("g", {
				id: "SVGRepo_tracerCarrier",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ jsx("g", {
				id: "SVGRepo_iconCarrier",
				children: /* @__PURE__ */ jsx("path", { d: "M11.3861 1.21065C11.7472 0.929784 12.2528 0.929784 12.6139 1.21065L21.6139 8.21065C21.8575 8.4001 22 8.69141 22 9V20.5C22 21.3284 21.3284 22 20.5 22H15V14C15 13.4477 14.5523 13 14 13H10C9.44772 13 9 13.4477 9 14V22H3.5C2.67157 22 2 21.3284 2 20.5V9C2 8.69141 2.14247 8.4001 2.38606 8.21065L11.3861 1.21065Z" })
			})
		]
	});
}
//#endregion
//#region src/components/icons/RightSingleChevron.tsx
var RightSingleChevron = () => {
	return /* @__PURE__ */ jsxs("svg", {
		viewBox: "7 4 11 16",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		className: "h-3 w-3 fill-slate-600",
		children: [
			/* @__PURE__ */ jsx("g", {
				id: "SVGRepo_bgCarrier",
				strokeWidth: "0"
			}),
			/* @__PURE__ */ jsx("g", {
				id: "SVGRepo_tracerCarrier",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ jsx("g", {
				id: "SVGRepo_iconCarrier",
				children: /* @__PURE__ */ jsx("path", {
					fillRule: "evenodd",
					clipRule: "evenodd",
					d: "M8.08586 5.41412C7.69534 5.80465 7.69534 6.43781 8.08586 6.82834L13.3788 12.1212L8.08586 17.4141C7.69534 17.8046 7.69534 18.4378 8.08586 18.8283L8.79297 19.5354C9.18349 19.926 9.81666 19.926 10.2072 19.5354L16.5607 13.1819C17.1465 12.5961 17.1465 11.6464 16.5607 11.0606L10.2072 4.70702C9.81666 4.31649 9.18349 4.31649 8.79297 4.70702L8.08586 5.41412Z"
				})
			})
		]
	});
};
//#endregion
//#region src/components/BreadCrumbs.tsx
var BreadCrumbs = () => {
	const pathSegments = useLocation().pathname?.split("/").filter(Boolean) || [];
	const isCourseRoute = pathSegments[0] === "course";
	const courseName = isCourseRoute && pathSegments[1] ? decodeURIComponent(pathSegments[1]) : null;
	const isLectureRoute = isCourseRoute && pathSegments[2] === "lecture";
	const lectureDate = isLectureRoute && pathSegments[3] ? decodeURIComponent(pathSegments[3]) : null;
	const lectureDateOnly = lectureDate ? (() => {
		const dateStr = lectureDate.split(" ")[0];
		const date = new Date(dateStr);
		return `${date.toLocaleDateString("en-US", { month: "short" })} ${date.getDate()}`;
	})() : null;
	const sharedBackgroundClassNames = `
    group 
    hover:bg-blue-900/30 
    rounded-lg 
    h-full 
    flex 
    items-center 
    transition
  `;
	const sharedLinkClassNames = `
    text-slate-300 
    transition 
    group-hover:text-slate-100 
    rounded-lg 
    h-full 
    flex 
    items-center 
    px-3
  `;
	return /* @__PURE__ */ jsxs("nav", {
		className: "flex flex-row font-bold text-sm items-center",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: sharedBackgroundClassNames,
				children: /* @__PURE__ */ jsx(Link, {
					to: "/",
					className: "flex items-center gap-1 rounded-lg h-full ",
					children: /* @__PURE__ */ jsx("span", {
						className: sharedLinkClassNames,
						children: /* @__PURE__ */ jsx(HomeIcon, {})
					})
				})
			}),
			courseName && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
				className: "text-slate-500 cursor-default select-none",
				children: /* @__PURE__ */ jsx(RightSingleChevron, {})
			}), /* @__PURE__ */ jsx("span", {
				className: sharedBackgroundClassNames,
				children: /* @__PURE__ */ jsx(Link, {
					to: `/course/${encodeURIComponent(courseName)}`,
					className: sharedLinkClassNames,
					children: courseName
				})
			})] }),
			isLectureRoute && lectureDate && courseName && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
				className: "text-slate-500 cursor-default select-none",
				children: /* @__PURE__ */ jsx(RightSingleChevron, {})
			}), /* @__PURE__ */ jsx("span", {
				className: sharedBackgroundClassNames,
				children: /* @__PURE__ */ jsx(Link, {
					to: `/course/${encodeURIComponent(courseName)}/lecture/${encodeURIComponent(lectureDate)}`,
					className: sharedLinkClassNames,
					children: lectureDateOnly
				})
			})] })
		]
	});
};
//#endregion
export { markdownToHTMLSafe as a, extractImageSources as i, RightSingleChevron as n, MarkdownDisplay as r, BreadCrumbs as t };
