const FORMATS = {
  TEXT: 'text/plain',
  HTML: 'text/html',
  PNG: 'image/png',
}

const SUPPORTED_FORMATS = new Set([FORMATS.TEXT, FORMATS.HTML, FORMATS.PNG])

const asyncClipboard = window.isSecureContext && navigator?.clipboard
const FEATURES = {
  asyncCopyText: !!asyncClipboard?.writeText,
  asyncCopyData: !!asyncClipboard?.write,
  syncCopy: !!document?.execCommand,
}

const syncCopy = data => {
  return new Promise((resolve, reject) => {
    const onExecCopy = event => {
      event.preventDefault()
      Object.entries(data).forEach(([format, value]) => {
        event.clipboardData.setData(format, value)
      })
      resolve()
    }
    try {
      document.addEventListener('copy', onExecCopy, true)
      document.execCommand('copy')
      throw new Error('Copy command failed')
    } catch (error) {
      reject(error)
    } finally {
      document.removeEventListener('copy', onExecCopy, true)
    }
  })
}

export const copyText = async text => {
  if (FEATURES.asyncCopyText) {
    try {
      return navigator.clipboard.writeText(text)
    } catch {
      // Do nothing
    }
  }
  if (FEATURES.execCopy) {
    try {
      return syncCopy({ [FORMATS.TEXT]: text })
    } catch {
      // Do nothing
    }
  }
  throw new Error('Copy operation not supported in this environment')
}

const checkAsyncFormatSupport = format => {
  if (ClipboardItem?.supports) {
    return ClipboardItem.supports(format)
  }
  return SUPPORTED_FORMATS.has(format)
}

export const copyData = async data => {
  const dataEntries = Object.entries(data)
  if (dataEntries.length === 1 && dataEntries[0][0] === FORMATS.TEXT) {
    return copyText(`${dataEntries[0][1]}`)
  }
  let asyncCopyEnabled = true
  let syncCopyEnabled = true
  for (const [format, value] of dataEntries) {
    if (value instanceof Blob || value instanceof Promise) {
      syncCopyEnabled = false
    }
    if (!checkAsyncFormatSupport(format)) {
      asyncCopyEnabled = false
    }
  }
  if (FEATURES.asyncCopyData && asyncCopyEnabled) {
    try {
      const clipboardItemObj = {}
      for (const [format, value] of Object.entries(data)) {
        if (value instanceof Blob || value instanceof Promise) {
          clipboardItemObj[format] = value
        } else {
          clipboardItemObj[format] = new Blob([value], { type: format })
        }
      }
      return await navigator.clipboard.write([new ClipboardItem(clipboardItemObj)])
    } catch {
      // Do nothing
    }
  }
  if (FEATURES.execCopy && syncCopyEnabled) {
    try {
      return syncCopy(data)
    } catch {
      // Do nothing
    }
  }
  throw new Error('Copy operation not supported for the given data format')
}

const copy = async value => {
  const valueType = typeof value
  if (valueType === 'object' && value !== null) {
    return copyData(value)
  }
  if (valueType !== 'undefined') {
    return copyText(`${value}`)
  }
  throw new Error('Unsupported value type for copy operation')
}

export default copy
