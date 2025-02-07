export interface IElectronAPI {
    setWindow: (data: any) => Promise<void>,
    // openFile: () => Promise<string>,
    minimize: () => Promise<void>,
    maximize: () => Promise<void>,
    close: () => Promise<void>,
    hide: () => Promise<void>,
    saveMessages: (message: any, type: string) => Promise<void>,
    getMessages: (param: string, type: string) => Promise<any>,
    getConfig: () => Promise<any>
    openChildWindow: (data: any) => Promise<void>
}

declare global {
    interface Window {
        electronAPI: IElectronAPI,
        versions: {
            chrome: string,
            node: string,
            electron: string
        },
        api: {
            queryDatabase: (query: string, params: string) => Promise<any>
        }
    }
}