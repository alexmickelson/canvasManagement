const scriptRegex = /<script.*?<\/script>/g;
const linkTagRegex = /<link\s+rel="[^"]*"\s+href="[^"]*"[^>]*>/g;

export const removeHtmlDetails = (html: string) => {
  return html
    .replaceAll(scriptRegex, "")
    .replaceAll(linkTagRegex, "")
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
