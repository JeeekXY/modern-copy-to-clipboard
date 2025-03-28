# Modern Copy to Clipboard

A modern clipboard copy utility that supports copying text, HTML, images, and custom MIME-type data.

## Features

- Support for multiple data types: text, HTML, images, etc.
- Support for custom MIME-type data
- Support for asynchronous data (like Blob)
- Simple and intuitive API
- Zero dependencies
- Lightweight

## Installation

```bash
npm install modern-copy-to-clipboard
# or
yarn add modern-copy-to-clipboard
```

## Usage

```js
import copy from 'modern-copy-to-clipboard'

// Copy plain text
copy('Hello World!')

// Copy HTML
copy({
  'text/plain': 'Hello World!',
  'text/html': '<p>Hello World!</p>'
})

// Copy custom MIME-type data
copy({
  'text/plain': 'Hello World!',
  'text/html': '<p>Hello World!</p>',
  'custom-data': '{"data":"Hello World!"}'
})

// Copy image
copy({
  'image/png': fetch(src).then(response => response.blob())
})
```

## API

### copy(data)

Copy data to clipboard.

#### Parameters

- `data`: Can be one of the following types:
  - `string`: Direct text to copy
  - `object`: Object containing different MIME-type data
  - `Promise`: Asynchronous data (like Blob)

#### Returns

- `Promise<void>`: Resolves when copy operation is complete

## Browser Compatibility

- Chrome 66+
- Firefox 63+
- Safari 13.1+
- Edge 79+

## License

MIT
