// root/rollup.config.base.mjs
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';

export function createConfig(packageJson) {
  return [
    {
      input: "src/index.ts",
      output: [
        {
          file: packageJson.main,
          format: "esm",
          sourcemap: true,
        },
        {
          file: packageJson.module,
          format: "esm",
          sourcemap: true,
        },
      ],
      plugins: [
        nodeResolve({
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.css']
        }),
        postcss({
          config: {
            path: "./postcss.config.js",
          },
          extract: false,
          minimize: true,
          inject: true,
        }),
        typescript({
          tsconfig: "./tsconfig.json",
          declaration: true,
          declarationDir: "./dist/types",
          jsx: "react"
        }),
      ],
      external: ["react", "react-dom", "@dimelords/shared", /\.css$/],
    },
    {
      input: "dist/types/index.d.ts",
      output: [{ file: "dist/index.d.ts", format: "esm" }],
      plugins: [dts()],
    },
  ];
}