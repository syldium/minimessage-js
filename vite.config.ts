import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'lib/main.ts'),
            name: 'MiniMessageDom',
            fileName: 'minimessage-dom',
        },
        target: 'esnext',
        minify: false
    },
    plugins: [dts({ rollupTypes: true })]
});
