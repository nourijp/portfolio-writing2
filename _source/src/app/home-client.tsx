"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import writingData from "../../public/data/writing-data.json";
import FilterBar from "./components/filter-bar";
import WritingCard, { WritingEntry } from "./components/writing-card";

const entries = writingData.entries as WritingEntry[];
const formats = ["All Writing", "Proposal", "Guide", "Announcement", "Learning Material", "Essay"];
const categories = Array.from(new Set(entries.flatMap(entry => entry.categories))).sort();

export default function HomeClient() {
  const searchParams = useSearchParams();
  const [selectedTypes, setSelectedTypes] = useState(["All Writing"]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [view, setView] = useState<"gallery" | "list">("gallery");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const format = searchParams.get("format");
    if (format && formats.includes(format)) setSelectedTypes([format]);
    setSelectedCategories((searchParams.get("category") || "").split(",").filter(value => categories.includes(value)));
    if (searchParams.get("view") === "list") setView("list");
    setReady(true);
    // Initialize the static page from its shareable URL once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams();
    if (selectedTypes[0] !== "All Writing") params.set("format", selectedTypes[0]);
    if (selectedCategories.length) params.set("category", selectedCategories.join(","));
    if (view === "list") params.set("view", "list");
    const query = params.toString();
    window.history.replaceState(null, "", query ? "/?" + query : "/");
  }, [selectedTypes, selectedCategories, view, ready]);

  const availableCategories = useMemo(() => {
    const scoped = selectedTypes[0] === "All Writing"
      ? entries
      : entries.filter(entry => entry.types.includes(selectedTypes[0]));
    return Array.from(new Set(scoped.flatMap(entry => entry.categories))).sort();
  }, [selectedTypes]);

  const filtered = useMemo(() => entries.filter(entry => {
    const formatMatch = selectedTypes[0] === "All Writing" || entry.types.includes(selectedTypes[0]);
    const categoryMatch = !selectedCategories.length || entry.categories.some(category => selectedCategories.includes(category));
    return formatMatch && categoryMatch;
  }), [selectedTypes, selectedCategories]);

  function selectFormat(format: string) {
    setSelectedTypes([format]);
    setSelectedCategories([]);
  }

  function toggleCategory(category: string) {
    setSelectedCategories(previous => previous.includes(category)
      ? previous.filter(value => value !== category)
      : [...previous, category]);
  }

  function clearFilters() {
    setSelectedTypes(["All Writing"]);
    setSelectedCategories([]);
  }

  return (
    <main className="pt-28 md:pt-36 pb-20">
      <div className="container">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">Selected Writing</h1>
          <p className="text-secondary mt-4 text-lg">
            Proposals, communications, documentation, and learning materials by Hamed Nouri.
          </p>
        </div>
        <FilterBar
          allTypes={formats}
          allCategories={availableCategories}
          allCompanies={[]}
          selectedTypes={selectedTypes}
          selectedCategories={selectedCategories}
          selectedCompanies={[]}
          onSetType={selectFormat}
          onToggleCategory={toggleCategory}
          onToggleCompany={() => {}}
          onClear={clearFilters}
          view={view}
          onSetView={setView}
        />
        <p className="text-sm text-secondary pt-5" role="status" aria-live="polite">{filtered.length} writing {filtered.length === 1 ? "sample" : "samples"}</p>
        {filtered.length === 0 ? (
          <p className="text-secondary py-16 text-center">No writing matches these filters. Clear the filters to see all samples.</p>
        ) : (
          <div className={view === "gallery" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 pt-6" : "pt-4"}>
            {filtered.map(entry => <WritingCard key={entry.slug} entry={entry} view={view} />)}
          </div>
        )}
      </div>
    </main>
  );
}
