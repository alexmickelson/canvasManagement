import { describe, it, expect } from "vitest";
import { markdownToHtmlNoImages } from "../htmlMarkdownUtils";

describe("Syntax Highlighting Tests", () => {
  it("should highlight JavaScript code blocks", () => {
    const markdown = `\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\``;

    const html = markdownToHtmlNoImages(markdown);
    
    // Check that the code block has proper structure
    expect(html).toContain('<pre class="language-javascript">');
    expect(html).toContain('<code class="language-javascript">');
    expect(html).toContain('function');
    expect(html).toContain('console'); // Just check for console, not console.log
    
    // Check that syntax highlighting tokens are present
    expect(html).toContain('<span class="token');
  });

  it("should highlight TypeScript code blocks", () => {
    const markdown = `\`\`\`typescript
interface User {
  name: string;
  age: number;
}
\`\`\``;

    const html = markdownToHtmlNoImages(markdown);
    
    expect(html).toContain('<pre class="language-typescript">');
    expect(html).toContain('<code class="language-typescript">');
    expect(html).toContain('interface');
    expect(html).toContain('string');
    expect(html).toContain('number');
    expect(html).toContain('<span class="token');
  });

  it("should highlight Python code blocks", () => {
    const markdown = `\`\`\`python
def hello_world():
    print("Hello, World!")
\`\`\``;

    const html = markdownToHtmlNoImages(markdown);
    
    expect(html).toContain('<pre class="language-python">');
    expect(html).toContain('<code class="language-python">');
    expect(html).toContain('def');
    expect(html).toContain('print');
    expect(html).toContain('<span class="token');
  });

  it("should handle unknown languages gracefully", () => {
    const markdown = `\`\`\`unknownlang
some code here
\`\`\``;

    const html = markdownToHtmlNoImages(markdown);
    
    // Should fallback to plain code block
    expect(html).toContain('<pre><code>');
    expect(html).toContain('some code here');
    expect(html).not.toContain('<span class="token');
  });

  it("should handle code blocks without language specification", () => {
    const markdown = `\`\`\`
plain code block
\`\`\``;

    const html = markdownToHtmlNoImages(markdown);
    
    // Should fallback to plain code block
    expect(html).toContain('<pre><code>');
    expect(html).toContain('plain code block');
    expect(html).not.toContain('<span class="token');
  });

  it("should preserve inline code formatting", () => {
    const markdown = `Here is some \`inline code\` in a paragraph.`;

    const html = markdownToHtmlNoImages(markdown);
    
    // Inline code should not be affected by syntax highlighting
    expect(html).toContain('<code>inline code</code>');
    expect(html).not.toContain('<pre>');
  });
});