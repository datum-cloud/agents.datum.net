type CodeBlockProps = {
  children: string;
};

/** Monospace shell/code block — matches the terminal aesthetic used by the
 * markdown lightbox (`--muted` surface, `--border` outline, `--font-mono`). */
export function CodeBlock({ children }: CodeBlockProps) {
  return (
    <pre className="bg-muted border-border text-foreground overflow-x-auto rounded-md border p-4 font-mono text-[13px] leading-[1.6]">
      <code>{children}</code>
    </pre>
  );
}
