const scriptTagRegex = /<script.*?<\/script>/g;
const linkTagRegex = /<link\s+rel="[^"]*"\s+href="[^"]*"[^>]*>/g;
const nonHrefAttributeRegex =
  /\s+(?!href\s*=)[\w-]+="[^"]*"|\s+(?!href\s*=)[\w-]+='[^']*'|\s+(?!href\s*=)[\w-]+=[^\s>]+/g;
const courseIdInImageUrlRegex =
  /(<img[^>]*src=")([^"]*)(\/courses\/\d+)([^"]*")/g;
const queryParametersInImageUrlRegex = /(<img[^>]*src="[^"]*)\?[^"]*"/g;
const escapedQuoteRegex = /\\"/g;
const whitespaceRegex = /\s/g;
const hrTagRegex = /<hr\s*\/?>/g;
const brTagRegex = /<br\s*\/?>/g;
const htmlGreaterThanRegex = /&gt;/g;
const htmlLessThanRegex = /&lt;/g;
const greaterThanRegex = />/g;
const lessThanRegex = /</g;
const htmlQuoteRegex = /&quot;/g;
const quoteRegex = /"/g;
const htmlAmpersandRegex = /&amp;/g;
const ampersandRegex = /&/g;
const unicodeEscapeRegex = /\\u[\dA-Fa-f]{4}/g;

function replaceUnicodeEscapes(input: string) {
  return input.replace(unicodeEscapeRegex, (match) => {
    // Extract the hexadecimal part and convert it to a character
    return String.fromCharCode(parseInt(match.slice(2), 16));
  });
}

export const removeHtmlDetails = (html: string) => {
  const withoutUnicode = replaceUnicodeEscapes(html);

  // First remove scripts and links
  let processed = withoutUnicode
    .replaceAll(scriptTagRegex, "")
    .replaceAll(linkTagRegex, "");

  // Remove all non-href attributes (including data-* attributes)
  processed = processed.replaceAll(nonHrefAttributeRegex, "");

  // Normalize image URLs by removing /courses/courseID pattern and query parameters
  processed = processed
    .replace(courseIdInImageUrlRegex, "$1$2$4")
    .replace(queryParametersInImageUrlRegex, '$1"');

  return processed
    .replaceAll(escapedQuoteRegex, '"')
    .replaceAll(whitespaceRegex, "")
    .replaceAll(hrTagRegex, "<hr>")
    .replaceAll(brTagRegex, "<br>")
    .replaceAll(htmlGreaterThanRegex, "")
    .replaceAll(htmlLessThanRegex, "")
    .replaceAll(greaterThanRegex, "")
    .replaceAll(lessThanRegex, "")
    .replaceAll(htmlQuoteRegex, "")
    .replaceAll(quoteRegex, "")
    .replaceAll(htmlAmpersandRegex, "")
    .replaceAll(ampersandRegex, "");
};

const logDifferences = (
  simple1: string,
  simple2: string,
  original1: string,
  original2: string
) => {
  const len1 = simple1.length;
  const len2 = simple2.length;
  const maxLen = Math.max(len1, len2);

  let firstDiff = -1;
  const diffs: Array<{ index: number; a: string; b: string }> = [];

  for (let i = 0; i < maxLen; i++) {
    const a = simple1[i] ?? "∅";
    const b = simple2[i] ?? "∅";
    if (a !== b) {
      if (firstDiff === -1) firstDiff = i;
      diffs.push({ index: i, a, b });
    }
  }

  // Group consecutive differences
  const diffGroups: Array<{
    startIndex: number;
    endIndex: number;
    a: string;
    b: string;
  }> = [];
  let currentGroup: {
    startIndex: number;
    endIndex: number;
    a: string;
    b: string;
  } | null = null;

  for (const diff of diffs) {
    if (currentGroup && diff.index === currentGroup.endIndex + 1) {
      // Extend current group
      currentGroup.endIndex = diff.index;
      currentGroup.a += diff.a;
      currentGroup.b += diff.b;
    } else {
      // Start new group
      if (currentGroup) diffGroups.push(currentGroup);
      currentGroup = {
        startIndex: diff.index,
        endIndex: diff.index,
        a: diff.a,
        b: diff.b,
      };
    }
  }
  if (currentGroup) diffGroups.push(currentGroup);

  const ctx = 30;
  const start = Math.max(0, (firstDiff === -1 ? 0 : firstDiff) - ctx);
  const end1 = Math.min(len1, (firstDiff === -1 ? 0 : firstDiff) + ctx);
  const end2 = Math.min(len2, (firstDiff === -1 ? 0 : firstDiff) + ctx);

  const mark = (s: string, sStart: number, idx: number, sEnd: number) => {
    if (idx < 0) return s.slice(sStart, sEnd);
    const before = s.slice(sStart, idx);
    const ch = s[idx] ?? "∅";
    const after = s.slice(idx + 1, sEnd);
    return `${before}[${ch}]${after}`;
  };

  console.log("htmlIsCloseEnough: differences detected");
  console.log(`len1=${len1}, len2=${len2}`);
  if (firstDiff !== -1) {
    console.log(`firstDiffAt=${firstDiff}`);
    console.log("s1:", mark(simple1, start, firstDiff, end1));
    console.log("s2:", mark(simple2, start, firstDiff, end2));
  }
  console.log(
    "difference groups:",
    diffGroups.slice(0, 10),
    original1,
    original2
  );
};

export const htmlIsCloseEnough = (html1: string, html2: string) => {
  const simple1 = removeHtmlDetails(html1);
  const simple2 = removeHtmlDetails(html2);

  if (simple1 !== simple2) {
    logDifferences(simple1, simple2, html1, html2);
  }
  return simple1 === simple2;
};
