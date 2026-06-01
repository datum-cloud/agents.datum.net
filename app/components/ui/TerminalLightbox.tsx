import { Icon } from '@/components/Icon';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface TerminalLightboxProps {
  open: boolean;
  onClose: () => void;
  /** URL to fetch the plain-text / markdown content from. */
  href: string;
  /** Title shown in the terminal title bar (e.g. `$ cat /index.md`). */
  title: string;
}

/**
 * Modal lightbox for viewing plain-text resources (`/index.md`,
 * `/llms.txt`). Surface colours follow the site's active light / dark
 * theme via the existing shadcn / datum-ui tokens.
 *
 * Renders nothing during SSR and until mounted — we need `document` for
 * the portal, and the modal shouldn't be in the SSR markup anyway.
 */
export function TerminalLightbox({ open, onClose, href, title }: TerminalLightboxProps) {
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch content the first time the lightbox is opened for a given href.
  useEffect(() => {
    if (!open || content !== null || error !== null) return;
    let cancelled = false;
    fetch(href, { headers: { Accept: 'text/plain,text/markdown,*/*' } })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((text) => {
        if (!cancelled) setContent(text);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'fetch failed';
          setError(`Could not load ${href} — ${msg}`);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [open, href, content, error]);

  // Close on Escape; lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(() => closeBtnRef.current?.focus());

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  async function onCopyMarkdown() {
    let text = content;
    if (text === null) {
      const response = await fetch(href, { headers: { Accept: 'text/plain,text/markdown,*/*' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      text = await response.text();
    }
    await navigator.clipboard.writeText(text);
  }

  if (!mounted || !open) return null;

  const display = error ?? content ?? 'Loading…';

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="terminal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div ref={frameRef} className="terminal-frame">
        <div className="terminal-titlebar">
          <span className="terminal-titlebar__prompt" aria-hidden="true">
            $
          </span>
          <span className="terminal-titlebar__title">{title}</span>
          <a
            href={href}
            className="terminal-titlebar__action"
            target="_blank"
            rel="noreferrer"
            aria-label="Open the raw file in a new tab">
            <span>raw</span>
            <Icon name="external-link" size="sm" className="terminal-titlebar__actionicon" />
          </a>
          <button
            type="button"
            onClick={onCopyMarkdown}
            className="terminal-titlebar__action"
            aria-label="Copy markdown content to clipboard">
            <Icon name="copy" size="sm" className="terminal-titlebar__actionicon" />
          </button>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="terminal-titlebar__close">
            esc
          </button>
        </div>
        <div className="terminal-body" tabIndex={0}>
          <pre className="terminal-output">{display}</pre>
        </div>
      </div>
    </div>,
    document.body
  );
}
