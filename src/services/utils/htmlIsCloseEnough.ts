const scriptRegex = /<script.*?<\/script>/g;
const linkTagRegex = /<link\s+rel="[^"]*"\s+href="[^"]*"[^>]*>/g;
const nonHrefAttribute =
  /\s+(?!href\s*=)\w+="[^"]*"|\s+(?!href\s*=)\w+='[^']*'|\s+(?!href\s*=)\w+=[^\s>]+/g;

function replaceUnicodeEscapes(input: string) {
  return input.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
    // Extract the hexadecimal part and convert it to a character
    return String.fromCharCode(parseInt(match.slice(2), 16));
  });
}

export const removeHtmlDetails = (html: string) => {
  const withoutUnicode = replaceUnicodeEscapes(html);
  return withoutUnicode
    .replaceAll(scriptRegex, "")
    .replaceAll(linkTagRegex, "")
    .replaceAll(nonHrefAttribute, "")
    .replaceAll(/\\"/g, '"')
    .replaceAll(/\s/g, "")
    .replaceAll(/<hr\s*\/?>/g, "<hr>")
    .replaceAll(/<br\s*\/?>/g, "<br>")
    .replaceAll(/&gt;/g, "")
    .replaceAll(/&lt;/g, "")
    .replaceAll(/>/g, "")
    .replaceAll(/</g, "")
    .replaceAll(/&quot;/g, "")
    .replaceAll(/"/g, "")
    .replaceAll(/&amp;/g, "")
    .replaceAll(/&/g, "");
};

export const htmlIsCloseEnough = (html1: string, html2: string) => {
  const simple1 = removeHtmlDetails(html1);
  const simple2 = removeHtmlDetails(html2);

  if (simple1 !== simple2) {
    const len1 = simple1.length;
    const len2 = simple2.length;
    const maxLen = Math.max(len1, len2);

    let firstDiff = -1;
    const diffs: Array<{ index: number; a: string; b: string }> = [];

    for (let i = 0; i < maxLen && diffs.length < 10; i++) {
      const a = simple1[i] ?? "∅";
      const b = simple2[i] ?? "∅";
      if (a !== b) {
        if (firstDiff === -1) firstDiff = i;
        diffs.push({ index: i, a, b });
      }
    }

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
    console.log("first 10 diffs:", diffs);
  }
  return simple1 === simple2;
};
