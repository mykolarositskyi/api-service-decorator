import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: 'index.ts',
    output: {
      file: 'dist/index.js',
      format: 'esm',
    },
    plugins: [typescript(), terser()],
  },
  {
    input: 'types/index.d.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'esm',
    },
    plugins: [dts()],
  },
]
