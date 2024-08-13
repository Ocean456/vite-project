import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    // openFile: () => ipcRenderer.invoke('dialog:openFile'),
    setWindow: (data: any) => ipcRenderer.send('set-window', data),
    minimize: () => ipcRenderer.send('minimize'),
    maximize: () => ipcRenderer.send('maximize'),
    close: () => ipcRenderer.send('close'),
    hide: () => ipcRenderer.send('hide'),
    saveMessages: (messages: any[], type: string) => ipcRenderer.invoke('save-messages', {messages, type}),
    getMessages: (param: string, type: string) => ipcRenderer.invoke('get-messages', {param, type}),
    getConfig: () => ipcRenderer.invoke('get-config'),
    openChildWindow: (data: any) => ipcRenderer.send('open-child-window', data)
})

contextBridge.exposeInMainWorld('versions', {
    chrome: process.versions.chrome,
    node: process.versions.node,
    electron: process.versions.electron
})
