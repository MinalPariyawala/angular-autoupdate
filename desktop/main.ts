
import { app, BrowserWindow, screen, Notification, dialog } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { autoUpdater } from 'electron-updater';
import * as log from "electron-log";

const args = process.argv.slice(1);
const serve = args.some(function (val) {
    return val === '--serve';
});
export let win: any;
let progressBar;
autoUpdater.autoDownload = false;

log.transports.file.resolvePath = () => path.join('C:/Users/Administrator/Desktop/minal/angular-autoupdate/', 'logs/main.log');
log.info('application version:', app.getVersion());

function createWindow() {

    const size = screen.getPrimaryDisplay().workAreaSize;
    win = new BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: true,
        },
    });

    // if (serve) {
    //     win.loadURL('http://localhost:4201');
    // } else {
    //     win.loadURL(url.format({
    //         pathname: path.join(__dirname, '../dist/index.html'),
    //         protocol: 'file:',
    //         slashes: true
    //     }));
    // }
    win.loadURL('http://localhost:4201');
    // win.loadFile(path.join(__dirname, './../src/index.html'));

    // The following is optional and will open the DevTools:
    win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}

function showNotification(body) {
    new Notification({
        title: "New Notification",
        body: body,
        silent: false,
        icon: path.join(__dirname, '../assets/AdminLTELogo.png')
    }).show()
}

// function startUpdateTimer() {
//     setInterval(() => {
//         autoUpdater.checkForUpdates();
//     }, 43200000);
//     setTimeout(() => {
//         autoUpdater.checkForUpdates();
//     }, 5000);
// }


app.on('ready', () => {
    createWindow();
    // startUpdateTimer();
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
    showNotification(`New version detected, downloading, please wait ${Math.floor(progress.percent)}`);
    log.info('download-progress', Math.floor(progress.percent));
})

autoUpdater.on('update-downloaded', () => {
    log.info('update-downloaded');
    showNotification(`Download Complete`);
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