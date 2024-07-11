import {app, BrowserWindow} from 'electron';

app.whenReady().then(() => {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        }
    });

    // win.webContents.openDevTools();


    if (process.argv[2]) {
        win.loadURL(process.argv[2])
    } else {
        win.loadFile('index.html')
    }

    win.removeMenu();

    win.resizable = false


})