interface LegalListBlock {
  type: 'list';
  items: string[];
}
interface LegalParaBlock {
  type: 'para';
  text: string;
}
interface LegalTableBlock {
  type: 'table';
  headers: string[];
  rows: string[][];
}
interface LegalSubsection {
  level: 2;
  heading: string;
  blocks: LegalBlock[];
}
interface LegalSubsectionBlock {
  type: 'subsection';
  data: LegalSubsection;
}
type LegalBlock = LegalParaBlock | LegalListBlock | LegalTableBlock | LegalSubsectionBlock;

interface LegalSection {
  level: 1;
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

function isUrl(text: string) {
  return /^https?:\/\//.test(text);
}

const LINKABLE_RE = /(https?:\/\/[^\s，。；、）]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g;

function linkify(text: string) {
  const parts = text.split(LINKABLE_RE);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-[#2257D4] hover:underline break-all">
          {part}
        </a>
      );
    }
    if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(part)) {
      return (
        <a key={i} href={`mailto:${part}`} className="text-[#2257D4] hover:underline">
          {part}
        </a>
      );
    }
    return part;
  });
}

function BlockRenderer({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case 'para':
      return <p className="text-sm text-gray-600 leading-relaxed">{linkify(block.text)}</p>;
    case 'list':
      return (
        <ul className="space-y-1.5 list-disc pl-5">
          {block.items.map((item, i) => (
            <li key={i} className="text-sm text-gray-600 leading-relaxed">{linkify(item)}</li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {block.headers.map((h, i) => (
                  <th key={i} className="text-left font-medium text-gray-700 px-3 py-2 border-b border-gray-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2 text-gray-600 align-top">
                      {isUrl(cell) ? (
                        <a href={cell} target="_blank" rel="noopener noreferrer" className="text-[#2257D4] hover:underline break-all">{cell}</a>
                      ) : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'subsection':
      return (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">{block.data.heading}</h4>
          <div className="space-y-2 pl-1">
            {block.data.blocks.map((b, i) => (
              <BlockRenderer key={i} block={b} />
            ))}
          </div>
        </div>
      );
  }
}

export default function LegalDocument({ doc, id }: { doc: LegalDoc; id?: string }) {
  return (
    <article id={id} className="space-y-8">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900">{doc.title}</h2>
        <p className="text-xs text-gray-400">最后修改日期：{doc.lastUpdated}</p>
      </header>

      <div className="space-y-6">
        {doc.sections.map((section, i) => (
          <section key={i} className="space-y-3 pt-6 border-t border-gray-100 first:pt-0 first:border-0">
            <h3 className="text-sm font-semibold text-gray-900">{section.heading}</h3>
            <div className="space-y-3">
              {section.blocks.map((b, j) => (
                <BlockRenderer key={j} block={b} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
