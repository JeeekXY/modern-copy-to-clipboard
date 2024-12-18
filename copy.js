const PlainTextFormat = 'text/plain'
const HtmlFormat = 'text/html'
const PngFormat = 'image/png'

const defaultAsyncFormatSet = new Set([PlainTextFormat, HtmlFormat, PngFormat])
const asyncCopySupport = !!(window.isSecureContext && navigator.clipboard)
const asyncCopyTextSupport = !!(asyncCopySupport && navigator.clipboard.writeText)
const asyncCopyDataSupport = !!(asyncCopySupport && navigator.clipboard.write)

const execCopySupport = !!document.execCommand

const asyncFormatsSupport = formats => {
  if (ClipboardItem && ClipboardItem.supports) {
    return formats.every(format => ClipboardItem.supports(format))
  }
  return formats.every(format => defaultAsyncFormatSet.has(format))
}

const execCopy = data => {
  const onExecCopy = event => {
    event.preventDefault()
    for (const [format, value] of Object.entries(data)) {
      event.clipboardData.setData(format, value)
    }
  }
  try {
    document.addEventListener('copy', onExecCopy)
    const execCopySuccess = document.execCommand('copy')
    if (!execCopySuccess) {
      throw new Error('copy failed')
    }
  } finally {
    document.removeEventListener('copy', onExecCopy)
  }
}

const asyncCopyText = text => {
  try {
    return navigator.clipboard.writeText(text)
  } catch {
    return execCopy({ PlainTextFormat: text })
  }
}

const asyncCopyData = (data, canFallback) => {
  try {
    const clipboardItemObj = {}
    for (const [format, value] of Object.entries(data)) {
      if (value instanceof Blob) {
        clipboardItemObj[format] = value
      } else {
        clipboardItemObj[format] = new Blob([value], { type: format })
      }
    }
    return navigator.clipboard.write([new ClipboardItem(clipboardItemObj)])
  } catch (error) {
    if (canFallback) {
      return execCopy(data)
    }
    throw error
  }
}

export const copyText = text => {
  if (asyncCopyTextSupport) {
    return asyncCopyText(text)
  }
  if (execCopySupport) {
    return execCopy({ PlainTextFormat: text })
  }
  throw new Error('Copy failed')
}

export const copyData = data => {
  const formats = Object.keys(data)
  if (formats.length === 1 && formats[0] === PlainTextFormat) {
    return copyText(data[PlainTextFormat])
  }
  const canFallback = Object.values(data).every(item => typeof item === 'string')
  if (asyncCopyDataSupport && asyncFormatsSupport(formats)) {
    return asyncCopyData(data, canFallback)
  }
  if (canFallback && execCopySupport) {
    return execCopy(data)
  }
  throw new Error('Copy failed')
}

const copy = async value => {
  if (typeof value === 'object' && value !== null) {
    return copyData(value)
  }
  if(typeof value === 'string') {
    return copyText(value)
  }
  throw new Error('Unsupported value type')
}

export default copy
