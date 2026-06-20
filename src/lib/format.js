export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return ''
  if (bytes === 0) return '0 KB'
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let value = bytes
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024
    i++
  }
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export function formatDate(isoString) {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function extensionOf(fileName = '') {
  const parts = fileName.split('.')
  return parts.length > 1 ? parts.pop().toLowerCase() : ''
}

export function catalogNumber(index) {
  return `NO. ${String(index + 1).padStart(3, '0')}`
}
