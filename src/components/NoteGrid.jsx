import { BookOpen, SearchX } from 'lucide-react'
import NoteCard from './NoteCard'

export default function NoteGrid({ notes, loading, hasFilters, onDownload, onUploadClick }) {
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 text-center text-slate text-sm">
        Pulling notes from the shelf…
      </div>
    )
  }

  if (notes.length === 0 && hasFilters) {
    return (
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-20 flex flex-col items-center text-center">
        <SearchX size={28} strokeWidth={1.5} className="text-slate/60 mb-3" />
        <p className="text-ink font-medium mb-1">No notes match that search</p>
        <p className="text-slate text-sm">Try a different keyword or clear the filter.</p>
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-20 flex flex-col items-center text-center">
        <BookOpen size={28} strokeWidth={1.5} className="text-slate/60 mb-3" />
        <p className="text-ink font-medium mb-1">The shelf is empty</p>
        <p className="text-slate text-sm mb-5">Be the first to add a note for everyone else.</p>
        <button
          onClick={onUploadClick}
          className="text-sm font-medium bg-ink text-paper px-4 py-2.5 rounded-sm hover:bg-pine-dark transition-colors"
        >
          Add a note
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note, i) => (
          <NoteCard key={note.id} note={note} index={i} onDownload={onDownload} />
        ))}
      </div>
    </div>
  )
}
