const MetadataSpanStart = '<span style="display: none;" data-hidden-copy-content>'
const MetadataSpanEnd = '</span>'
const MetadataCopyContentRegex = new RegExp(`${MetadataSpanStart}(.*)${MetadataSpanEnd}`)

const attachMetadataCopyContent = (htmlText, metadata) =>
  `${htmlText}${MetadataSpanStart}${metadata}${MetadataSpanEnd}`

const getMetadataCopyContent = htmlText => {
  const matches = htmlText.match(MetadataCopyContentRegex)
  if (matches) {
    return matches[1]
  }
  return ''
}

const extractMetadataCopyContent = htmlText => {
  const copyContent = getMetadataCopyContent(htmlText)
  const pureHtmlText = htmlText.replace(MetadataCopyContentRegex, '')
  return [pureHtmlText, copyContent]
}

export { attachMetadataCopyContent, getMetadataCopyContent, extractMetadataCopyContent }
