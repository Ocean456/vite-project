import {app, BrowserWindow, ipcMain, Menu, Tray, Notification} from 'electron';
import * as path from 'node:path';
import express from 'express';
import DatabaseService from "./db";

const expressApp = express();
expressApp.use(express.static('public'));
expressApp.get('/', (_, res) => {
    res.send('Hello World!');
});

const db = new DatabaseService();

let tray = null;
let win: BrowserWindow;

function createWindow() {
    win = new BrowserWindow({
        width: 400,
        height: 370,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
            webSecurity: false,
        },
        titleBarStyle: 'hidden',
        transparent: true,
        autoHideMenuBar: true,
        resizable: false,
        frame: false,
    });


    if (process.argv[2]) {
        win.loadURL(process.argv[2]).then(_ => console.log());
    } else {
        win.loadFile('index.html').then(r => console.log(r));
    }


    win.webContents.openDevTools();

    win.webContents.setWindowOpenHandler(({url}) => {
        win.loadURL(url).then(r => console.log(r));
        return {action: 'deny'}
    });

    win.center();

    ipcMain.on('set-window', (_, data) => {
        win.setResizable(true);
        win.setSize(data.width, data.height);
        win.center();
        win.setResizable(false);
    });

    ipcMain.on('minimize', () => {
        win.minimize();
    });

    ipcMain.on('maximize', () => {
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize();
        }
    });

    ipcMain.on('hide', () => {
        win.hide();
    });

    ipcMain.on('close', () => {
        win.close();
    });

    ipcMain.on('open-child-window', (_,data) => {
        const childWindow = new BrowserWindow({
            parent: win,
            width: 400,
            height: 400,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                nodeIntegration: true,
                contextIsolation: true,
                webSecurity: false,
            },
            titleBarStyle: 'hidden',
        });
        childWindow.loadURL(data.url).then(r => console.log(r));
    });
}


function showSystemNotification() {
    const notification = new Notification({
        title: 'Basic Notification',
        body: 'Notification from the Main process'
    });
    notification.show();
}


app.whenReady().then(() => {

    // ipcMain.handle('dialog:openFile', handleFileOpen);

    createWindow();
    showSystemNotification()


    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });


    ipcMain.handle('save-messages', async (_, {type, messages}) => {
        try {
            await db.saveMessages(JSON.parse(messages), type);
        } catch (error) {
            console.error('Database save messages error:', error);
            throw error;
        }
    });
    ipcMain.handle('get-messages', async (_, {param, type}) => {
        try {
            return await db.getMessages(param, type);
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    });
    ipcMain.handle('get-config', async () => {
        try {
            return await db.getConfig();
        } catch (error) {
            console.error('Error fetching config data:', error);
            throw error;
        }
    });

    tray = new Tray(path.join(__dirname, 'cloud.png'));
    tray.setToolTip('This is my application.');
    const contextMenu = Menu.buildFromTemplate([
        {label: 'Show App', click: () => win.show()},
        {label: 'Quit', click: () => app.quit()}
    ]);
    tray.addListener('click', () => {
        win.isVisible() ? win.hide() : win.show();
    });
    tray.setContextMenu(contextMenu);


});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// async function handleFileOpen() {
//     const {canceled, filePaths} = await dialog.showOpenDialog({});
//     if (!canceled) {
//         return filePaths[0];
//     }
// }


