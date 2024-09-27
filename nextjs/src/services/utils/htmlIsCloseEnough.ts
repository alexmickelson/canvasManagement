const scriptRegex = /<script.*?<\/script>/g;
const linkTagRegex = /<link\s+rel="[^"]*"\s+href="[^"]*"[^>]*>/g;
const htmlAttribute = /\s+\w+="[^"]*"|\s+\w+='[^']*'|\s+\w+=[^\s>]+/g;

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
    .replaceAll(htmlAttribute, "")
    .replaceAll(/\\"/g, '"')
    .replaceAll(/\s/g, "")
    .replaceAll(/<hr\s*\/?>/g, "<hr>")
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
  return simple1 === simple2;
};
