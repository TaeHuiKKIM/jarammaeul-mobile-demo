import {build} from 'vite';
import {rename} from 'node:fs/promises';
await build({configFile:'vite.prototype.config.ts'});
await rename('vercel-static-v3/prototype.html','vercel-static-v3/index.html');
