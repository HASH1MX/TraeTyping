// vite.config.js
export default {
  root: './',
  base: './', // Set base to relative path for GitHub Pages
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  },
  server: {
    port: 3000,
    open: true
  }
};