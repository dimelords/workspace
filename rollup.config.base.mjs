// root/rollup.config.base.mjs
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import federation from '@module-federation/rollup-federation';

export function createConfig(packageJson) {
  return [
    {
      input: 'src/index.ts',
      output: [
        {
          dir: 'dist',
          entryFileNames: '[name].mjs',
          format: 'esm',
          sourcemap: true,
          preserveModules: true,
          preserveModulesRoot: 'src',
        },
        {
          file: 'dist/index.umd.js',
          format: 'umd',
          name: '[name]',
          sourcemap: true,
        },
      ],
      plugins: [
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
        federation({
          shared: {
            react: {
              eager: true,
              singleton: true,
              requiredVersion: '^18.2.0',
            },
            'react-dom': {
              eager: true,
              singleton: true,
              requiredVersion: '^18.2.0',
            },
          },
        }),
      ],
      external: ['react', 'react-dom', '@dimelords/shared', /\.css$/],
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        '@dimelords/shared': 'DimelordShared',
      },
    },
    {
      input: 'dist/types/index.d.ts',
      output: [{ file: 'dist/index.d.ts', format: 'esm' }],
      plugins: [dts()],
    },
  ];
}
