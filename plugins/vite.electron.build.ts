import * as fs from "node:fs";
import type {Plugin} from "vite";
import * as electronBuilder from 'electron-builder'
import * as path from "node:path";

const buildBackground = () => {
    import('esbuild').then((esbuild) => {
        esbuild.build({
            entryPoints: ['src/background.ts', 'src/preload.ts'],
            bundle: true,
            outdir: 'dist',
            platform: 'node',
            target: 'node22',
            external: ['electron'],
        })
    })

}

export const ElectronBuilderPlugin = (): Plugin => {
    return {
        name: 'electron-build',
        closeBundle() {
            buildBackground()
            const json = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
            json.main = 'background.js'
            fs.writeFileSync('dist/package.json', JSON.stringify(json, null, 4))
            fs.mkdirSync('dist/node_modules', {recursive: true})

            electronBuilder.build({
                config: {
                    directories: {
                        output: path.resolve(process.cwd(), 'release'),
                        app: path.resolve(process.cwd(), 'dist')
                    },
                    appId: 'com.example.app2',
                    productName: 'Demo',
                    asar: true,
                    nsis: {
                        oneClick: false,
                        allowToChangeInstallationDirectory: true,
                    },
                    asarUnpack: [
                        'node_modules/**/*'
                    ],

                }
            })
        }
    }
}