import { describe, it, expect } from 'vitest';
import { markdownToHtmlNoImages } from './htmlMarkdownUtils';

describe('markdownToHtmlNoImages reference links', () => {
  it('renders reference links inside a table', () => {
    const markdown = `
| Header |
| --- |
| [QuickStart][Fort1] |

[Fort1]: https://example.com/fort1
`;
    const html = markdownToHtmlNoImages(markdown);
    expect(html).toContain('<a href="https://example.com/fort1">QuickStart</a>');
  });
});
