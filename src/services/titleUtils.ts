export function getTitle(title: string) {
  const prefix = process.env.NEXT_PUBLIC_TITLE_PREFIX
    ? process.env.NEXT_PUBLIC_TITLE_PREFIX + " "
    : "";
  return `${prefix}${title}`;
}
