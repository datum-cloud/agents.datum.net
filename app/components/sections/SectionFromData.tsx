import { Section } from '../layout/Section';
import { SectionBody } from '../layout/SectionBody';
import { SectionRow } from '../layout/SectionRow';
import { SectionRowList } from '../layout/SectionRowList';
import type { Block, InlineNode, SectionData } from '@/lib/page-content';
import { parseInline } from '@/lib/page-content';
import { Fragment, type ReactNode } from 'react';

/** Render an InlineNode[] (from parseInline) as React children. */
function renderInline(nodes: InlineNode[]): ReactNode {
  return nodes.map((n, i) => {
    if (n.type === 'text') return <Fragment key={i}>{n.text}</Fragment>;
    if (n.type === 'bold') {
      return (
        <strong key={i} className="font-semibold">
          {n.text}
        </strong>
      );
    }
    if (n.type === 'code') {
      return (
        <code key={i} className="font-mono text-[0.875em]">
          {n.text}
        </code>
      );
    }
    // Links: external links open in a new tab.
    const external = /^https?:\/\//.test(n.href);
    return (
      <a
        key={i}
        href={n.href}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        className="underline">
        {n.text}
      </a>
    );
  });
}

/**
 * Group consecutive non-row blocks together (so they share one SectionBody
 * wrapper) and emit each `rows` block as its own SectionRowList. This keeps
 * spacing tight when several paragraphs run together, and lets a section
 * mix rows with a trailing note (see PricingSection).
 */
type Group =
  | { kind: 'body'; blocks: Exclude<Block, { kind: 'rows' }>[] }
  | { kind: 'rows'; rows: { label: string; text: string }[] };

function group(blocks: readonly Block[]): Group[] {
  const groups: Group[] = [];
  for (const b of blocks) {
    const last = groups[groups.length - 1];
    if (b.kind === 'rows') {
      if (last?.kind === 'rows') {
        last.rows.push(...b.rows);
      } else {
        groups.push({ kind: 'rows', rows: [...b.rows] });
      }
    } else {
      if (last?.kind === 'body') {
        last.blocks.push(b);
      } else {
        groups.push({ kind: 'body', blocks: [b] });
      }
    }
  }
  return groups;
}

function BodyBlock({ block }: { block: Exclude<Block, { kind: 'rows' }> }) {
  if (block.kind === 'p') {
    return <p>{renderInline(parseInline(block.text))}</p>;
  }
  if (block.kind === 'note') {
    return (
      <p className="text-foreground/60 text-[14px] leading-[21px]">
        {renderInline(parseInline(block.text))}
      </p>
    );
  }
  // kind === 'ul'
  return (
    <ul className="flex flex-col gap-2">
      {block.items.map((item, i) => (
        <li key={i}>{renderInline(parseInline(item))}</li>
      ))}
    </ul>
  );
}

/**
 * Render a SectionData entry as the full numbered chapter — replaces the
 * boilerplate inside every per-section component file.
 */
export function SectionFromData({ section }: { section: SectionData }) {
  const groups = group(section.blocks);

  return (
    <Section id={section.id} n={section.n} title={section.title}>
      <div className="flex flex-col gap-4">
        {groups.map((g, i) => {
          if (g.kind === 'body') {
            return (
              <SectionBody key={i}>
                {g.blocks.map((b, j) => (
                  <BodyBlock key={j} block={b} />
                ))}
              </SectionBody>
            );
          }
          return (
            <SectionRowList key={i}>
              {g.rows.map((r, j) => (
                <SectionRow key={j} label={r.label}>
                  {renderInline(parseInline(r.text))}
                </SectionRow>
              ))}
            </SectionRowList>
          );
        })}
      </div>
    </Section>
  );
}
