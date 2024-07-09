import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {ElectronDevPlugin} from "./plugins/vite.electron.dev";
import {ElectronBuilderPlugin} from "./plugins/vite.electron.build";
import {fileURLToPath} from "node:url";


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        ElectronDevPlugin(),
        ElectronBuilderPlugin()
    ],
    base: './',
/*    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }*/
})
