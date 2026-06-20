import {
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Presentation,
  File as FileIcon,
  Download,
} from 'lucide-react'
import { formatBytes, formatDate, extensionOf, catalogNumber } from '../lib/format'

const ICONS = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  txt: FileText,
  ppt: Presentation,
  pptx: Presentation,
  xls: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  csv: FileSpreadsheet,
  jpg: ImageIcon,
  jpeg: ImageIcon,
  png: ImageIcon,
  webp: ImageIcon,
}

export default function NoteCard({ note, index, onDownload }) {
  const ext = extensionOf(note.file_name)
  const Icon = ICONS[ext] || FileIcon

  return (
    <div className="group bg-card border border-line rounded-md p-5 flex flex-col hover:border-pine/40 hover:shadow-[0_1px_0_0_rgba(0,0,0,0.03)] transition-colors">
      <div className="flex items-start justify-between mb-3.5">
        <span className="font-mono text-[0.68rem] tracking-wide text-slate/80">
          {catalogNumber(index)}
        </span>
        <Icon size={18} strokeWidth={1.6} className="text-pine/70" />
      </div>

      <h3 className="font-display text-[1.05rem] leading-snug text-ink mb-1.5">
        {note.title}
      </h3>

      {note.subject && (
        <span className="inline-block text-[0.68rem] font-medium uppercase tracking-wide text-pine bg-pine/[0.08] px-2 py-0.5 rounded-sm w-fit mb-2.5">
          {note.subject}
        </span>
      )}

      {note.description && (
        <p className="text-[0.85rem] text-slate leading-relaxed mb-4 line-clamp-3">
          {note.description}
        </p>
      )}

      <div className="mt-auto pt-3 border-t border-line/70 flex items-center justify-between gap-3">
        <div className="font-mono text-[0.68rem] text-slate/80 leading-tight min-w-0">
          <div className="truncate">{note.uploader_name || 'Anonymous'}</div>
          <div>
            {formatDate(note.created_at)} · {formatBytes(note.file_size)}
          </div>
        </div>
        <button
          onClick={() => onDownload(note)}
          aria-label={`Download ${note.title}`}
          className="shrink-0 inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-ink border border-line rounded-sm px-3 py-2 hover:bg-ink hover:text-paper hover:border-ink transition-colors"
        >
          <Download size={14} strokeWidth={2} />
          Download
        </button>
      </div>
    </div>
  )
}
