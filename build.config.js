import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig([
  {
    entries: [
      {
        input: 'src/index',
        name: 'index',
      },
    ],
    declaration: 'node16',
    rollup: {
      esbuild: {
        target: 'es2019',
      },
      output: {
        format: 'esm',
      },
    },
  },
  {
    entries: [
      {
        input: 'src/index',
        name: 'index.min',
      },
    ],
    rollup: {
      esbuild: {
        minify: true,
        target: 'es2019',
      },
      output: {
        format: 'iife',
        name: 'copyToClipboard',
      },
    },
  },
])
