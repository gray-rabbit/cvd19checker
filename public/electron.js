const { app, BrowserWindow, ipcMain } = require('electron');

const path = require('path');
const fetch = require('electron-fetch').default
const isDev = require('electron-is-dev')

require('electron-reload')(__dirname, {
    electron: `${__dirname}/node_modules/electron`
})

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 660,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
        }
    })
    mainWindow.loadURL(
        isDev ?
            'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
    )
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.on('closed', () => mainWindow = null);


    ipcMain.on('test-message', (event, args) => {
        console.log(args, '여기는 메인임ssss');
        event.returnValue = "메인에서 r고dddd쳐서 보낸다 보낸다!";
    })
    ipcMain.on('fetch-get', (event, args) => {
        console.log(args);
        console.log(fetch);
        fetch(args).then(r=>r.text()).then(r => {
            event.reply('test-message-reply', r);
        })
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') { app.quit(); }
})

app.on('activate', () => {
    if (mainWindow !== null) {
        createWindow();
    }
})


