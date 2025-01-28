import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';

export function createConfig(packageJson) {
  return [
    {
      input: 'src/index.ts',
      external: ['react', 'react-dom', '@dimelords/shared', 'lucide-react', /\.css$/],
      output: [
        {
          dir: 'dist',
          entryFileNames: '[name].mjs',
          format: 'esm',
          sourcemap: true,          
        }
      ],
      plugins: [
        babel({
          presets: ['@babel/preset-react'],
          exclude: 'node_modules/**',
          babelHelpers: 'bundled',
        }),
        terser(),
        nodeResolve({
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
        }),
        postcss({
          config: {
            path: './postcss.config.js',
          },
          extract: false,
          minimize: true,
          inject: true,
        }),
        typescript({
          tsconfig: './tsconfig.json',
          declaration: true,
          declarationDir: './dist/types',
          jsx: 'react',
        }),
      ],
    },
    {
      input: 'dist/types/index.d.ts',
      output: [{ file: 'dist/index.d.ts', format: 'esm' }],
      plugins: [dts()],
    },
  ];
}
