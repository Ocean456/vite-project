import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {ElectronDevPlugin} from "./plugins/vite.electron.dev"
import {ElectronBuilderPlugin} from "./plugins/vite.electron.build"
import {fileURLToPath} from "node:url";
import commonjs from 'vite-plugin-commonjs'


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        commonjs(),
        ElectronDevPlugin(),
        ElectronBuilderPlugin(),
    ],
    base: './',
    /*    resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }*/
    build: {
        rollupOptions: {
            external: ['electron', 'better-sqlite3'],
        }
    }
})
