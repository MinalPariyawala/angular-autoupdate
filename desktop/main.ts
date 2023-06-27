
import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { autoUpdater } from 'electron-updater';
import * as log from "electron-log";

log.transports.file.resolvePath = () => path.join('C:/Users/Administrator/Desktop/minal/angular-autoupdate/', 'logs/main.log');
log.info('application version:', app.getVersion());
log.info('hello');

export let win: any;

function createWindow() {
    win = new BrowserWindow({
        width: 300, height: 400
    });
    win.loadURL('http://localhost:4201');
    // win.loadFile(path.join(__dirname, 'src/index.html'));
}


app.on('ready', () => {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify();
})

autoUpdater.on('update-available', () => {
    log.info('update-available');
})

autoUpdater.on('checking-for-update', () => {
    log.info('checking-for-update');
})

autoUpdater.on('download-progress', (progress) => {
    log.info('download-progress', progress);
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