import { useRef, useState } from 'react'
import { X, UploadCloud, Loader2, FileCheck2 } from 'lucide-react'
import { supabase, NOTES_TABLE, NOTES_BUCKET } from '../lib/supabase'
import { formatBytes } from '../lib/format'

const ACCEPTED_EXTENSIONS = [
  '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt',
  '.xls', '.xlsx', '.csv', '.jpg', '.jpeg', '.png', '.webp',
]
const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB

const initialForm = { title: '', subject: '', uploaderName: '', description: '' }

export default function UploadDrawer({ open, onClose, onUploaded }) {
  const [form, setForm] = useState(initialForm)
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [status, setStatus] = useState('idle') // idle | uploading | error
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  if (!open) return null

  function resetAndClose() {
    setForm(initialForm)
    setFile(null)
    setStatus('idle')
    setError('')
    onClose()
  }

  function handleFileSelect(selected) {
    if (!selected) return
    if (selected.size > MAX_FILE_SIZE) {
      setError(`That file is over the ${formatBytes(MAX_FILE_SIZE)} limit.`)
      return
    }
    setError('')
    setFile(selected)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Give the note a title.')
      return
    }
    if (!file) {
      setError('Attach a file to share.')
      return
    }

    setStatus('uploading')
    setError('')

    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
      const path = `${crypto.randomUUID()}-${safeName}`

      const { error: uploadError } = await supabase.storage
        .from(NOTES_BUCKET)
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const { data: inserted, error: insertError } = await supabase
        .from(NOTES_TABLE)
        .insert({
          title: form.title.trim(),
          subject: form.subject.trim() || null,
          uploader_name: form.uploaderName.trim() || null,
          description: form.description.trim() || null,
          file_path: path,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type || null,
        })
        .select()
        .single()

      if (insertError) throw insertError

      onUploaded(inserted)
      resetAndClose()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Something went wrong while uploading. Try again.')
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={status === 'uploading' ? undefined : resetAndClose}
      />

      <div className="relative bg-card w-full sm:max-w-md sm:rounded-md rounded-t-md border border-line shadow-xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-line sticky top-0 bg-card">
          <h2 className="font-display text-[1.2rem] text-ink">Add a note</h2>
          <button
            onClick={resetAndClose}
            aria-label="Close"
            className="text-slate hover:text-ink"
            disabled={status === 'uploading'}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <Field label="Title" required>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Organic Chemistry — Midterm 2 review"
              className="input"
              disabled={status === 'uploading'}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Course Code">
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Biology"
                className="input"
                disabled={status === 'uploading'}
              />
            </Field>
            <Field label="Your name">
              <input
                type="text"
                value={form.uploaderName}
                onChange={(e) => setForm({ ...form, uploaderName: e.target.value })}
                placeholder="Optional"
                className="input"
                disabled={status === 'uploading'}
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What's covered in these notes?"
              rows={3}
              className="input resize-none"
              disabled={status === 'uploading'}
            />
          </Field>

          <Field label="File" required>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                handleFileSelect(e.dataTransfer.files?.[0])
              }}
              className={`border border-dashed rounded-sm px-4 py-6 text-center cursor-pointer transition-colors ${
                dragOver ? 'border-pine bg-pine/5' : 'border-line hover:border-pine/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_EXTENSIONS.join(',')}
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
                disabled={status === 'uploading'}
              />
              {file ? (
                <div className="flex items-center justify-center gap-2 text-sm text-ink">
                  <FileCheck2 size={16} className="text-pine" />
                  <span className="truncate max-w-[220px]">{file.name}</span>
                  <span className="text-slate">· {formatBytes(file.size)}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-slate">
                  <UploadCloud size={20} strokeWidth={1.6} />
                  <span className="text-sm">Drop a file here, or click to browse</span>
                  <span className="text-xs">PDF, Word, slides, sheets, or images · up to 20MB</span>
                </div>
              )}
            </div>
          </Field>

          {error && <p className="text-clay text-sm -mt-1">{error}</p>}

          <button
            type="submit"
            disabled={status === 'uploading'}
            className="mt-1 inline-flex items-center justify-center gap-2 bg-ink text-paper font-medium text-sm py-3 rounded-sm hover:bg-pine-dark transition-colors disabled:opacity-60"
          >
            {status === 'uploading' ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading…
              </>
            ) : (
              'Share with everyone'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[0.78rem] font-medium text-slate">
        {label}
        {required && <span className="text-clay"> *</span>}
      </span>
      {children}
    </label>
  )
}
