import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://gsrabogados.com.ar',
  trailingSlash: 'always',
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  prefetch: true,
});