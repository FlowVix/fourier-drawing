import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import FullReload from "vite-plugin-full-reload";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vitejs.dev/config/
export default defineConfig({
    // build: {
    //     target: "esnext",
    // },
    base: "/fourier-drawing/",
    plugins: [
        svelte(),
        FullReload("src/**/*"),
        wasm(),
        topLevelAwait({
            // The export name of top-level await promise for each chunk module
            promiseExportName: "__tla",
            // The function to generate import names of top-level await promise in each chunk module
            promiseImportName: i => `__tla_${i}`,
        }),
    ],
});
