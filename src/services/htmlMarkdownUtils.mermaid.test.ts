import { describe, it, expect } from 'vitest';
import { markdownToHtmlNoImages } from './htmlMarkdownUtils';

describe('markdownToHtmlNoImages', () => {
  it('renders mermaid diagrams correctly using pako compression', () => {
    const markdown = `
\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\`
    `;
    const html = markdownToHtmlNoImages(markdown);
    
    // The expected URL part for the graph above when compressed with pako
    const expectedUrlPart = "pako:eNqrVkrOT0lVslJKL0osyFAIcbGOyVMAAkddXTsnJLYzlO0EZMPUOIPZSjpKualFuYmZKUpW1UolGam5IONSUtMSS3NKlGprAQJ0Gx4";
    
    expect(html).toContain(`https://mermaid.ink/img/${expectedUrlPart}`);
  });
});
