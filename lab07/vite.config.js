import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const webExtensions = ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'];

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: /^react-native$/, replacement: require.resolve('react-native-web') }],
    extensions: webExtensions,
  },
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      resolveExtensions: webExtensions,
      loader: { '.js': 'jsx' },
    },
  },
});
