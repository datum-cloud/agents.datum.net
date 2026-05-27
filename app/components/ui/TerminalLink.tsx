import { TerminalLightbox } from './TerminalLightbox';
import { useState, type MouseEvent, type ReactNode } from 'react';

interface TerminalLinkProps {
  /** Resource to fetch and display in the lightbox. */
  href: string;
  /** Title shown in the terminal title bar (e.g. `$ cat /index.md`). */
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Anchor that opens its target inside a CRT-style lightbox on plain click.
 * Modifier-key clicks (⌘ / Ctrl / Shift / Alt) and middle-clicks bypass the
 * modal and follow the native link — so right-click → "Open in new tab"
 * and "Save link as…" still work, and AI crawlers reach the raw URL.
 */
export function TerminalLink({ href, title, children, className }: TerminalLinkProps) {
  const [open, setOpen] = useState(false);

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (e.button !== 0) return;
    e.preventDefault();
    setOpen(true);
  }

  return (
    <>
      <a href={href} onClick={onClick} className={className}>
        {children}
      </a>
      <TerminalLightbox open={open} onClose={() => setOpen(false)} href={href} title={title} />
    </>
  );
}
