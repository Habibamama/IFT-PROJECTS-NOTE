import { useEffect, useMemo, useState, useCallback } from 'react'
import { supabase, NOTES_TABLE, NOTES_BUCKET } from './lib/supabase'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import NoteGrid from './components/NoteGrid'
import UploadDrawer from './components/UploadDrawer'

export default function App() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [activeSubject, setActiveSubject] = useState(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [loadError, setLoadError] = useState('')

  const fetchNotes = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from(NOTES_TABLE)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setLoadError('Could not load notes. Check your Supabase setup in the README.')
    } else {
      setLoadError('')
      setNotes(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const subjects = useMemo(() => {
    const set = new Set(notes.map((n) => n.subject).filter(Boolean))
    return Array.from(set).sort()
  }, [notes])

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase()
    return notes.filter((n) => {
      const matchesSubject = !activeSubject || n.subject === activeSubject
      if (!matchesSubject) return false
      if (!q) return true
      const haystack = `${n.title} ${n.subject || ''} ${n.description || ''} ${
        n.uploader_name || ''
      }`.toLowerCase()
      return haystack.includes(q)
    })
  }, [notes, query, activeSubject])

  function handleDownload(note) {
    const { data } = supabase.storage.from(NOTES_BUCKET).getPublicUrl(note.file_path)
    const url = data?.publicUrl
    if (!url) return
    const link = document.createElement('a')
    link.href = url
    link.download = note.file_name
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function handleUploaded(newNote) {
    setNotes((prev) => [newNote, ...prev])
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onUploadClick={() => setUploadOpen(true)} noteCount={loading ? null : notes.length} />

      <SearchBar
        query={query}
        onQueryChange={setQuery}
        subjects={subjects}
        activeSubject={activeSubject}
        onSubjectChange={setActiveSubject}
      />

      {loadError ? (
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 text-center text-clay text-sm">
          {loadError}
        </div>
      ) : (
        <NoteGrid
          notes={filteredNotes}
          loading={loading}
          hasFilters={Boolean(query || activeSubject)}
          onDownload={handleDownload}
          onUploadClick={() => setUploadOpen(true)}
        />
      )}

      <footer className="mt-auto border-t border-line">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-6 text-center text-xs text-slate/80">
          Shared by students, for students.
        </div>
      </footer>

      <UploadDrawer
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={handleUploaded}
      />
    </div>
  )
}
