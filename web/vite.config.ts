import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: Number(process.env.SIM_GRAB_WEB_PORT ?? 7879),
    strictPort: true,
    fs: {
      // allow importing from the ../shared/ directory (monorepo root)
      allow: ['..'],
    },
  },
});
