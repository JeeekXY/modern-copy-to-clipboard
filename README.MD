# Copy to clipboard

Provide a simple way to copy text, html, png, or custom MIME type data to clipboard.

# Example
```js
import copy from 'modern-copy-to-clipboard'

// Copy plain text
copy('Text')

// Copy html
copy({
  'text/plain': 'Hello World!',
  'text/html': '<p>Hello World!</p>'
})

// Copy custom MIME type data
copy({
  'text/plain': 'Hello World!',
  'text/html': '<p>Hello World!</p>'
  'custom-data': '{"data":"Hello World!"}'
})

// Copy png Image
copy({
  'image/png':
})
```
