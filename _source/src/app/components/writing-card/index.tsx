export type WritingEntry = {
  slug: string;
  title: string;
  description: string;
  categories: string[];
  types: string[];
  format: string;
  audience: string;
  context: string;
  body: string;
  preview: string;
  featured: boolean;
  download?: string;
};

export default function WritingCard({ entry, view }: { entry: WritingEntry; view: "gallery" | "list" }) {
  const href = "/writing/" + entry.slug + "/";
  if (view === "list") {
    return (
      <a href={href} className="group flex items-center gap-4 py-5 border-b border-softGray hover:bg-softGray/50 transition-colors px-2 -mx-2 rounded-lg">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold leading-snug">{entry.title}</h2>
          <p className="text-sm text-secondary mt-1">{entry.description}</p>
        </div>
        <span className="hidden sm:block text-xs py-1 px-3 rounded-full bg-softGray">{entry.format}</span>
        <span aria-hidden="true" className="text-secondary group-hover:text-primary">→</span>
      </a>
    );
  }
  return (
    <a href={href} className="group block h-full">
      <div className="document-preview relative rounded-xl overflow-hidden bg-softGray px-6 pt-6 h-64 sm:h-72">
        <div className="document-sheet bg-white min-h-full p-6 shadow-sm transition-transform duration-300 group-hover:-translate-y-1" aria-hidden="true">
          <div className="text-[10px] uppercase tracking-widest text-primary mb-4">{entry.format}</div>
          <div className="text-xl font-semibold leading-tight text-black mb-4">{entry.title}</div>
          <div className="text-xs leading-relaxed text-secondary">{entry.preview}</div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-softGray to-transparent" />
      </div>
      <div className="flex flex-col gap-2 pt-4">
        <div className="flex flex-wrap gap-1.5">
          {entry.categories.map(category => (
            <span key={category} className="text-xs py-1 px-2.5 rounded-full bg-softGray text-black">{category}</span>
          ))}
        </div>
        <h2 className="text-xl font-semibold leading-snug group-hover:text-primary transition-colors">{entry.title}</h2>
        <p className="text-sm text-secondary leading-relaxed">{entry.description}</p>
      </div>
    </a>
  );
}
