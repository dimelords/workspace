import { createConfig } from '../../rollup.config.base.mjs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const packageJson = require("./package.json");

export default createConfig(packageJson);