import { describe, it, expect } from 'vitest';
import { markdownToHtmlNoImages } from './htmlMarkdownUtils';

describe('markdownToHtmlNoImages', () => {
  it('moves caption into table when caption immediately precedes table', () => {
    const markdown = `<caption>My Table</caption>

| Header |
| --- |
| Cell |`;
    const html = markdownToHtmlNoImages(markdown);
    // We expect the caption to be inside the table
    expect(html).toMatch(/<table>\s*<caption>My Table<\/caption>/);
  });

  it('renders table correctly without caption', () => {
    const markdown = `
| Header |
| --- |
| Cell |`;
    const html = markdownToHtmlNoImages(markdown);
    expect(html).toMatch(/<table>/);
    expect(html).not.toMatch(/<caption>/);
    expect(html).toContain('Header');
    expect(html).toContain('Cell');
  });

  it('moves caption with attributes into table', () => {
    const markdown = `<caption style="color:red">My Table</caption>

| Header |
| --- |
| Cell |`;
    const html = markdownToHtmlNoImages(markdown);
    expect(html).toMatch(/<table>\s*<caption style="color:red">My Table<\/caption>/);
  });
});
