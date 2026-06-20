import { Search, X } from 'lucide-react'

export default function SearchBar({
  query,
  onQueryChange,
  subjects,
  activeSubject,
  onSubjectChange,
}) {
  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-8 pb-4">
      <div className="relative">
        <Search
          size={17}
          strokeWidth={2}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by title, subject, or keyword…"
          className="w-full bg-card border border-line rounded-sm pl-11 pr-10 py-3.5 text-[0.95rem] text-ink placeholder:text-slate/70 focus:outline-none focus:border-pine transition-colors"
        />
        {query && (
          <button
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate hover:text-ink"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {subjects.length > 0 && (
        <div className="flex items-center gap-2 mt-3.5 overflow-x-auto scrollbar-thin pb-1 -mx-1 px-1">
          <Chip
            label="All subjects"
            active={!activeSubject}
            onClick={() => onSubjectChange(null)}
          />
          {subjects.map((s) => (
            <Chip
              key={s}
              label={s}
              active={activeSubject === s}
              onClick={() => onSubjectChange(s)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap text-[0.78rem] font-medium px-3 py-1.5 rounded-sm border transition-colors ${
        active
          ? 'bg-pine text-paper border-pine'
          : 'bg-card text-slate border-line hover:border-pine/50 hover:text-ink'
      }`}
    >
      {label}
    </button>
  )
}
