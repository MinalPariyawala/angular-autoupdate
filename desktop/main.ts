
import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import { autoUpdater } from 'electron-updater';
import * as log from "electron-log";

log.transports.file.resolvePath = () => path.join('C:/Users/Administrator/Desktop/minal/angular-autoupdate/', 'logs/main.log');
log.info('hello');
log.info('application version:', app.getVersion());

export let win: any;

function createWindow() {

    const size = screen.getPrimaryDisplay().workAreaSize;
    win = new BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    win.loadURL('http://localhost:4201');
    // win.loadFile(path.join(__dirname, 'src/index.html'));

    // The following is optional and will open the DevTools:
    // win.webContents.openDevTools()

    win.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}


app.on('ready', () => {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify();
})

autoUpdater.on('update-available', (info) => {
    log.info('update-available');
    log.info('version', info.version);
    log.info('release date', info.releaseDate);
})

autoUpdater.on('checking-for-update', () => {
    log.info('checking-for-update');
})

autoUpdater.on('download-progress', (progress) => {
    log.info('download-progress', Math.floor(progress.percent));
})

autoUpdater.on('update-downloaded', () => {
    log.info('update-downloaded');
    setTimeout(() => {
        autoUpdater.quitAndInstall();
    }, 6000);
})

autoUpdater.on('update-not-available', () => {
    log.info('update-not-available');
})

autoUpdater.on('error', (err) => {
    log.info('error', err);
})