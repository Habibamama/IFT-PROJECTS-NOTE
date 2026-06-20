import { Plus, BookMarked } from 'lucide-react'

export default function Header({ onUploadClick, noteCount }) {
  return (
    <header className="border-b border-line bg-paper/95 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <BookMarked size={22} className="text-pine shrink-0" strokeWidth={1.75} />
          <div>
            <h1 className="font-display text-[1.4rem] leading-none tracking-tight text-ink">
              Notebank
            </h1>
            <p className="hidden sm:block text-[0.8rem] text-slate leading-none mt-1">
              {noteCount === null
                ? 'Loading the shelf…'
                : `${noteCount} note${noteCount === 1 ? '' : 's'} on the shelf`}
            </p>
          </div>
        </div>

        <button
          onClick={onUploadClick}
          className="inline-flex items-center gap-1.5 bg-ink text-paper text-sm font-medium px-4 py-2.5 rounded-sm hover:bg-pine-dark transition-colors"
        >
          <Plus size={16} strokeWidth={2} />
          <span>Add a note</span>
        </button>
      </div>
    </header>
  )
}
