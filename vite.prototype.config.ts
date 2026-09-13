import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],build:{outDir:'vercel-static-v3',rollupOptions:{input:'prototype.html'}},server:{port:3013,strictPort:true}});
