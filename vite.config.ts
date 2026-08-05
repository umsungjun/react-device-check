import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactDeviceCheck',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: ['react'],
      output: {
        // Marks the bundle as a Client Component boundary so Next.js App Router users get a clear error when importing from a Server Component. Inert in CJS and non-RSC bundlers.
        banner: '"use client";',
        globals: {
          react: 'React',
        },
      },
    },
  },
  plugins: [
    dts({
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/test/**'],
      outDir: 'dist',
      // Bundle declarations into a single index.d.ts with no relative imports,
      // so it can be safely copied to index.d.mts for the ESM entry
      rollupTypes: true,
    }),
  ],
});
