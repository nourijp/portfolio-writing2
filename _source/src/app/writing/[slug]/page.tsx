import { notFound } from "next/navigation";
import { marked } from "marked";
import writingData from "../../../../public/data/writing-data.json";
import { WritingEntry } from "../../components/writing-card";

const entries = writingData.entries as WritingEntry[];

export function generateStaticParams() {
  return entries.map(entry => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = entries.find(item => item.slug === slug);
  if (!entry) return {};
  return {
    title: entry.title + " — Hamed Nouri",
    description: entry.description,
    alternates: { canonical: "/writing/" + entry.slug + "/" },
  };
}

export default async function WritingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = entries.find(item => item.slug === slug);
  if (!entry) notFound();
  const bodyHtml = marked.parse(entry.body, { async: false });

  return (
    <main className="min-h-screen bg-white pt-28 md:pt-36 pb-24">
      <div className="container max-w-4xl">
        <a href="/" className="text-sm text-secondary hover:text-primary transition-colors inline-flex items-center gap-2 mb-10">
          <span aria-hidden="true">←</span> All writing
        </a>
        <div className="flex flex-wrap gap-2 mb-4">
          {entry.categories.map(category => (
            <a href={"/?category=" + encodeURIComponent(category)} key={category} className="text-xs py-1 px-3 rounded-full bg-softGray hover:bg-primary hover:text-white transition-colors">{category}</a>
          ))}
          <span className="text-xs py-1 px-3 rounded-full bg-primary text-white">{entry.format}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-5">{entry.title}</h1>
        <p className="text-lg text-secondary leading-relaxed mb-7">{entry.description}</p>
        <div className="text-sm text-secondary pb-7 mb-9 border-b border-mistGray space-y-2">
          <p className="text-sm"><strong className="font-medium text-black">Audience</strong> {entry.audience}</p>
          <p className="text-sm">{entry.context}</p>
          {entry.download && <a className="inline-flex py-2 text-primary hover:underline font-medium" href={entry.download}>Download Word sample ↓</a>}
        </div>
        <article className="writing-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        <div className="mt-12 pt-6 border-t border-mistGray">
          <a href="/" className="text-primary hover:underline">Browse all writing →</a>
        </div>
      </div>
    </main>
  );
}
