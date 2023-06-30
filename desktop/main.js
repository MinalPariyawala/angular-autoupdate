"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.win = void 0;
const electron_1 = require("electron");
const path = require("path");
const url = require("url");
const electron_updater_1 = require("electron-updater");
const log = require("electron-log");
const ProgressBar = require("electron-progressbar");
const args = process.argv.slice(1);
const serve = args.some(function (val) {
    return val === '--serve';
});
let updater = null;
let progressBar;
let notification;
let downloadPercent;
let updateWindow = null;
electron_updater_1.autoUpdater.autoDownload = false;
log.transports.file.resolvePath = () => path.join('C:/Users/Administrator/Desktop/minal/angular-autoupdate/', 'logs/main.log');
log.info('application version:', electron_1.app.getVersion());
// Application menu
const appMenu = electron_1.Menu.buildFromTemplate([{
        label: 'File',
        submenu: [
            { label: 'Check for updates...', click: (item, win, event) => { checkForUpdates(item, win, event); } },
            { label: 'Quit', click: () => { electron_1.app.quit(); } }
        ]
    }, {
        label: 'Debug',
        submenu: [
            { label: 'Open DevTools', click: () => { exports.win.webContents.openDevTools({ mode: 'detach' }); } }
        ]
    }
]);
function createWindow() {
    const size = electron_1.screen.getPrimaryDisplay().workAreaSize;
    exports.win = new electron_1.BrowserWindow({
        x: 0,
        y: 0,
        width: 500,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: true,
            contextIsolation: false
        },
    });
    if (serve) {
        exports.win.loadURL('http://localhost:4201');
        // win.loadURL(url.format({
        //     pathname: path.join(__dirname, '../dist/index.html'), protocol: 'file:', slashes: true
        // }));
    }
    else {
        exports.win.loadURL(url.format({
            pathname: path.join(__dirname, '../dist/index.html'), protocol: 'file:', slashes: true
        }));
    }
    // The following is optional and will open the DevTools:
    // win.webContents.openDevTools()
    // Emitted when the window is closed.
    exports.win.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        exports.win = null;
    });
}
function showNotification(title = "New Notification", body) {
    new electron_1.Notification({
        title: title,
        body: body,
        silent: false,
        icon: path.join(__dirname, '../dist/assets/AdminLTELogo.png')
    }).show();
}
function startUpdateTimer() {
    setInterval(() => {
        electron_updater_1.autoUpdater.checkForUpdates();
    }, 18000000);
    setTimeout(() => {
        electron_updater_1.autoUpdater.checkForUpdates();
    }, 5000);
}
function checkForUpdates(menuItem, focusedWindow, event) {
    updater = menuItem;
    updater.enabled = false;
    electron_updater_1.autoUpdater.checkForUpdates();
}
function createUpdateDialog(info) {
    if (updateWindow == null) {
        updateWindow = true;
        electron_1.dialog.showMessageBox(exports.win, {
            type: "info",
            title: 'Software Update',
            message: 'A new version of autoupdate is available!',
            detail: `Autoupdate ${info.version} is now available\u2014you have ${electron_updater_1.autoUpdater.currentVersion}. Would you like to download it now?`,
            buttons: ['Yes', 'Remind me Later']
        }).then((buttonIndex) => {
            log.info('buttonIndex', buttonIndex);
            if (buttonIndex.response === 0) {
                startDownload();
            }
            else {
                if (updater != null) {
                    updater.enabled = true;
                    updater = null;
                }
            }
            updateWindow = null;
        });
    }
}
function startDownload() {
    log.info('strat download');
    progressBar = new ProgressBar({
        indeterminate: true,
        detail: 'Downloading...',
        title: 'Auto Updater',
    });
    progressBar
        .on('progress', function (value) {
        log.info('progress value', value);
        log.info('progress downloadPercent', downloadPercent);
        progressBar.detail = `Value ${downloadPercent} out of 100...`;
    })
        .on('completed', function () {
        log.info(`completed...`);
        progressBar.detail = 'Download completed. Exiting...';
    });
    electron_updater_1.autoUpdater.downloadUpdate();
}
function ensureSafeQuitAndInstall() {
    electron_1.app.removeAllListeners('window-all-closed');
    var browserWindows = electron_1.BrowserWindow.getAllWindows();
    browserWindows.forEach(function (browserWindow) {
        browserWindow.removeAllListeners('close');
    });
    setImmediate(() => { electron_updater_1.autoUpdater.quitAndInstall(); });
}
electron_1.app.on('ready', () => {
    electron_1.Menu.setApplicationMenu(appMenu);
    createWindow();
    startUpdateTimer();
    // autoUpdater.checkForUpdatesAndNotify();
});
electron_updater_1.autoUpdater.on('update-available', (info) => {
    log.info('update-available');
    log.info('version', info.version);
    log.info('release date', info.releaseDate);
    if (updater == null) {
        notification = new electron_1.Notification({ title: 'A new version is ready to download', body: `${electron_1.app.getName()} version ${info.version} can be downloaded and installed` });
        notification.on('click', () => {
            createUpdateDialog(info);
        });
        notification.show();
    }
    else {
        createUpdateDialog(info);
    }
});
electron_updater_1.autoUpdater.on('checking-for-update', () => {
    log.info('checking-for-update');
});
electron_updater_1.autoUpdater.on('download-progress', (progress) => {
    // showNotification("New version detected, downloading, please wait" + progress.percent);
    exports.win.setProgressBar(progress.percent);
    downloadPercent = progress.percent;
    log.info('download-progress', progress.percent);
});
electron_updater_1.autoUpdater.on('update-downloaded', () => {
    log.info('update-downloaded');
    showNotification('Download Complete', 'Download Complete');
    progressBar.setCompleted();
    progressBar.close();
    electron_1.dialog.showMessageBox(exports.win, {
        title: 'Ready to Install',
        message: 'The software has been downloaded. Click Restart to relaunch the new version...',
        buttons: ['Restart']
    }).then(() => {
        ensureSafeQuitAndInstall();
    });
    // setTimeout(() => {
    //     autoUpdater.quitAndInstall();
    // }, 6000);
});
electron_updater_1.autoUpdater.on('update-not-available', () => {
    log.info('update-not-available');
    showNotification('No update found.', 'Application up-to-date');
});
electron_updater_1.autoUpdater.on('error', (err) => {
    log.info('error', err);
});
electron_1.ipcMain.on('get-items', (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        event.returnValue = electron_1.app.getVersion();
    }
    catch (err) {
        throw err;
    }
}));
//# sourceMappingURL=main.js.map