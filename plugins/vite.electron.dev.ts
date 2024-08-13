import type {Plugin} from "vite";
import type {AddressInfo} from "node:net";
import {spawn} from 'child_process'
import electron from 'electron';
import * as fs from "node:fs";

const buildBackground = () => {
    import('esbuild').then((esbuild) => {
        esbuild.build({
            entryPoints: ['src/background.ts', 'src/preload.ts'],
            bundle: true,
            // outfile: 'dist/background.js',
            outdir: 'dist',
            platform: 'node',
            target: 'node22',
            external: ['electron'],
        })
    })
}

export const ElectronDevPlugin = (): Plugin => {
    return {
        name: 'electron-dev',
        configureServer(server) {
            buildBackground()
            server?.httpServer?.once('listening', () => {
                const address = server.httpServer?.address() as AddressInfo
                const IP = "http://localhost:" + address.port

                // @ts-ignore
                let ElectronProcess: electron = spawn(electron, ['dist/background.js', IP])
                fs.watchFile('src/background.ts', () => {
                    ElectronProcess.kill()
                    buildBackground()
                    // @ts-ignore
                    ElectronProcess = spawn(electron, ['dist/background.js', IP])
                })
                // console.log(address.port)
                ElectronProcess.stderr?.on('data', (data: any) => {
                    console.error("Log: " + data.toString())
                })
            })
        }
    }
}