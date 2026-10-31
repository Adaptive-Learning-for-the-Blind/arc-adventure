import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Relative paths, so the build works under /arc-adventure/ on GitHub Pages.
  base: './',
  test: {
    environment: 'jsdom',
  },
});
