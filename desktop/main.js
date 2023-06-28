"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.win = void 0;
const electron_1 = require("electron");
const path = require("path");
const electron_updater_1 = require("electron-updater");
const log = require("electron-log");
const args = process.argv.slice(1);
const serve = args.some(function (val) {
    return val === '--serve';
});
log.transports.file.resolvePath = () => path.join('C:/Users/Administrator/Desktop/minal/angular-autoupdate/', 'logs/main.log');
log.info('hello');
log.info('application version:', electron_1.app.getVersion());
function createWindow() {
    const size = electron_1.screen.getPrimaryDisplay().workAreaSize;
    exports.win = new electron_1.BrowserWindow({
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
    exports.win.loadURL('http://localhost:4201');
    // win.loadFile(path.join(__dirname, './../src/index.html'));
    // The following is optional and will open the DevTools:
    exports.win.webContents.openDevTools();
    // Emitted when the window is closed.
    exports.win.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        exports.win = null;
    });
}
function showNotification(body) {
    new electron_1.Notification({
        title: "New Notification",
        body: body,
        silent: false,
        icon: path.join(__dirname, '../assets/AdminLTELogo.png')
    }).show();
}
electron_1.app.on('ready', () => {
    createWindow();
    electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
});
electron_updater_1.autoUpdater.on('update-available', (info) => {
    log.info('update-available');
    log.info('version', info.version);
    log.info('release date', info.releaseDate);
});
electron_updater_1.autoUpdater.on('checking-for-update', () => {
    log.info('checking-for-update');
});
electron_updater_1.autoUpdater.on('download-progress', (progress) => {
    showNotification(`New version detected, downloading, please wait ${Math.floor(progress.percent)}`);
    log.info('download-progress', Math.floor(progress.percent));
});
electron_updater_1.autoUpdater.on('update-downloaded', () => {
    log.info('update-downloaded');
    showNotification(`Download Complete`);
    setTimeout(() => {
        electron_updater_1.autoUpdater.quitAndInstall();
    }, 6000);
});
electron_updater_1.autoUpdater.on('update-not-available', () => {
    log.info('update-not-available');
});
electron_updater_1.autoUpdater.on('error', (err) => {
    log.info('error', err);
});
//# sourceMappingURL=main.js.map