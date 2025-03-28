const MIME_TYPES = {
  TEXT: 'text/plain',
  HTML: 'text/html',
  PNG: 'image/png',
}

const checkAsyncClipboardSupport = () => {
  if (!navigator.clipboard) {
    throw new Error('Clipboard API is not supported')
  }
  if (!isSecureContext) {
    throw new Error('Secure context (HTTPS or localhost) required')
  }
}

const syncCopy = data => {
  if (!document.execCommand) {
    throw new Error('"execCommand" is not supported')
  }
  return new Promise((resolve, reject) => {
    const onCopy = event => {
      event.preventDefault()
      event.stopPropagation()
      Object.entries(data).forEach(([format, value]) => {
        if (value instanceof Blob || value instanceof Promise) {
          event.clipboardData.clearData()
          throw new Error(`Invalid value of MIME-type: ${format}`)
        }
        event.clipboardData.setData(`${format}`, `${value}`)
      })
      resolve()
    }

    try {
      document.addEventListener('copy', onCopy, true)
      const execSuccess = document.execCommand('copy')
      if (!execSuccess) {
        throw new Error('Failed to trigger copy event')
      } else {
        throw new Error('Failed to capture copy event')
      }
    } catch (error) {
      reject(error)
    } finally {
      document.removeEventListener('copy', onCopy, true)
    }
  })
}

const copyText = text => {
  const errorMsgs = []

  try {
    checkAsyncClipboardSupport()
    if (!navigator.clipboard.writeText) {
      throw new Error('Clipboard API method "writeText" is not supported')
    }
    return navigator.clipboard.writeText(text)
  } catch (e) {
    errorMsgs.push(`Async copy failed: ${e.message}`)
  }

  try {
    return syncCopy({ [MIME_TYPES.TEXT]: text })
  } catch (e) {
    errorMsgs.push(`Sync copy failed: ${e.message}`)
  }

  throw new Error(['Failed to copy text', ...errorMsgs].join('\n'))
}

let SUPPORTED_MIME_TYPES
const checkAsyncTypeSupport = type => {
  if (ClipboardItem.supports) {
    ClipboardItem.supports(type)
  }
  if (!SUPPORTED_MIME_TYPES) {
    SUPPORTED_MIME_TYPES = new Set([MIME_TYPES.TEXT, MIME_TYPES.HTML, MIME_TYPES.PNG])
  }
  return SUPPORTED_MIME_TYPES.has(type)
}

const copyData = async data => {
  const errorMsgs = []
  const dataEntries = Object.entries(data)

  if (dataEntries.length === 1) {
    const [type, value] = dataEntries[0]
    if (type === MIME_TYPES.TEXT && !(value instanceof Blob || value instanceof Promise)) {
      return copyText(value)
    }
  }

  try {
    checkAsyncClipboardSupport()
    if (!navigator.clipboard.write && !ClipboardItem) {
      throw new Error('Clipboard API method "write" is not supported')
    }
    const record = {}
    await Promise.all(
      dataEntries.map(async ([type, rawValue]) => {
        if (!checkAsyncTypeSupport(type)) {
          throw new Error(`Invalid MIME-type: ${type}`)
        }
        const value = await rawValue
        if (value instanceof Blob) {
          record[type] = value
        } else {
          record[type] = new Blob([`${value}`], { type })
        }
      }),
    )
    return navigator.clipboard.write([new ClipboardItem(record)])
  } catch (e) {
    errorMsgs.push(`Async copy failed: ${e.message}`)
  }

  try {
    return syncCopy(data)
  } catch (e) {
    errorMsgs.push(`Sync copy failed: ${e.message}`)
  }

  throw new Error(['Failed to copy data', ...errorMsgs].join('\n'))
}

const copy = async data => {
  const type = typeof data
  if (type === 'object' && data !== null) {
    return copyData(data)
  }
  return copyText(`${data}`)
}

export default copy
