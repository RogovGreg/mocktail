import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths(), svgr()],
    server: {
        host: true,
        port: 5173,
        proxy: {
            '/api/v1/': 'http://localhost',
        },
    },
});
