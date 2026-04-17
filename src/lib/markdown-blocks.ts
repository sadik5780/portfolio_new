import type { BlogBlock } from '@/data/blog-posts';

export function markdownToBlocks(md: string): BlogBlock[] {
  const lines = md.split('\n');
  const blocks: BlogBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') {
      i++;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      const text = trimmed.slice(3).trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      blocks.push({ type: 'h2', text, id });
      i++;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', text: trimmed.slice(4).trim() });
      i++;
      continue;
    }

    if (trimmed.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quoteLines.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ type: 'quote', text: quoteLines.join('\n') });
      continue;
    }

    if (/^[-*] /.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*] /, ''));
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    if (/^\d+\. /.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\. /, ''));
        i++;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    if (trimmed === '---') {
      i++;
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('## ') &&
      !lines[i].trim().startsWith('### ') &&
      !lines[i].trim().startsWith('> ') &&
      !/^[-*] /.test(lines[i].trim()) &&
      !/^\d+\. /.test(lines[i].trim()) &&
      lines[i].trim() !== '---'
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'p', text: paraLines.join(' ') });
    }
  }

  return blocks;
}

export function blocksToMarkdown(blocks: BlogBlock[]): string {
  const parts: string[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case 'h2':
        parts.push(`## ${block.text}`);
        break;
      case 'h3':
        parts.push(`### ${block.text}`);
        break;
      case 'p':
        parts.push(block.text);
        break;
      case 'ul':
        parts.push(block.items.map((item) => `- ${item}`).join('\n'));
        break;
      case 'ol':
        parts.push(block.items.map((item, i) => `${i + 1}. ${item}`).join('\n'));
        break;
      case 'quote':
        parts.push(
          block.text
            .split('\n')
            .map((l) => `> ${l}`)
            .join('\n'),
        );
        break;
      case 'cta':
        parts.push(`> **${block.title}** — ${block.text} [${block.label}](${block.href})`);
        break;
      case 'callout':
        parts.push(`> **${block.title ?? block.variant}:** ${block.text}`);
        break;
      case 'table':
        if (block.headers.length > 0) {
          parts.push(
            `| ${block.headers.join(' | ')} |`,
            `| ${block.headers.map(() => '---').join(' | ')} |`,
            ...block.rows.map((row) => `| ${row.join(' | ')} |`),
          );
        }
        break;
    }
    parts.push('');
  }

  return parts.join('\n').trim();
}
