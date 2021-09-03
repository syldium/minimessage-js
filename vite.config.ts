import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-dts";

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'lib/main.ts'),
            name: 'MiniMessageDom',
            fileName: (format) => `minimessage-dom.${format}.js`
        },
        target: 'esnext',
        minify: false
    },
    plugins: [dts()]
});
