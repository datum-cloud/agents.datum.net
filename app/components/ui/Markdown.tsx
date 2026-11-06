import { CodeBlock } from './CodeBlock';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const INLINE_CODE = 'font-mono text-[0.875em]';

/**
 * Element overrides so rendered markdown matches the rest of the site:
 * fenced code goes through `CodeBlock`, tables scroll horizontally, and
 * headings use the page's type scale.
 */
const components: Components = {
  h1: ({ children }) => (
    <h1 className="mt-6 text-[32px] leading-[38px] font-semibold">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="border-border mt-12 border-t pt-8 text-[24px] leading-[30px] font-semibold">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 text-[18px] leading-[26px] font-semibold">{children}</h3>
  ),
  p: ({ children }) => <p className="mt-4">{children}</p>,
  ul: ({ children }) => <ul className="mt-4 flex list-disc flex-col gap-2 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="mt-4 flex list-decimal flex-col gap-2 pl-6">{children}</ol>,
  a: ({ href, children }) => (
    <a href={href} className="underline">
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="mt-4 overflow-x-auto">
      <table className="border-border w-full border-collapse border text-left text-[14px] leading-[21px]">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-border bg-muted border px-3 py-2 align-top font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border-border border px-3 py-2 align-top">{children}</td>,
  // Fenced blocks render as <pre><code>; unwrap the <pre> so CodeBlock owns it.
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children }) => {
    const text = String(children);
    const isBlock = Boolean(className?.startsWith('language-')) || text.includes('\n');
    if (isBlock) {
      return (
        <div className="mt-4">
          <CodeBlock>{text.replace(/\n$/, '')}</CodeBlock>
        </div>
      );
    }
    return <code className={INLINE_CODE}>{children}</code>;
  },
};

type MarkdownProps = {
  children: string;
};

/** Renders trusted, repo-owned markdown (raw HTML is not enabled). */
export function Markdown({ children }: MarkdownProps) {
  return (
    <div className="text-foreground text-[16px] leading-[24px]">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
