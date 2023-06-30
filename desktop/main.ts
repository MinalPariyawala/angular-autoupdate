
import { app, BrowserWindow, screen, Notification, dialog, Menu, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { autoUpdater } from 'electron-updater';
import * as log from "electron-log";
import * as ProgressBar from 'electron-progressbar';

const args = process.argv.slice(1);
const serve = args.some(function (val) {
    return val === '--serve';
});

export let win: any;
let updater = null;
let progressBar;
let notification;
let downloadPercent;
let updateWindow = null;

autoUpdater.autoDownload = false;

log.transports.file.resolvePath = () => path.join('C:/Users/Administrator/Desktop/minal/angular-autoupdate/', 'logs/main.log');
log.info('application version:', app.getVersion());

// Application menu
const appMenu = Menu.buildFromTemplate([{
    label: 'File',
    submenu: [
        { label: 'Check for updates...', click: (item, win, event) => { checkForUpdates(item, win, event); } },
        { label: 'Quit', click: () => { app.quit(); } }
    ]
}, {
    label: 'Debug',
    submenu: [
        { label: 'Open DevTools', click: () => { win.webContents.openDevTools({ mode: 'detach' }); } }
    ]
}
]);

function createWindow() {
    const size = screen.getPrimaryDisplay().workAreaSize;
    win = new BrowserWindow({
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
        win.loadURL('http://localhost:4201');
        // win.loadURL(url.format({
        //     pathname: path.join(__dirname, '../dist/index.html'), protocol: 'file:', slashes: true
        // }));
    } else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, '../dist/index.html'), protocol: 'file:', slashes: true
        }));
    }


    // The following is optional and will open the DevTools:
    // win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}

function showNotification(title = "New Notification", body) {
    new Notification({
        title: title,
        body: body,
        silent: false,
        icon: path.join(__dirname, '../dist/assets/AdminLTELogo.png')
    }).show()
}

function startUpdateTimer() {
    setInterval(() => {
        autoUpdater.checkForUpdates();
    }, 18000000);
    setTimeout(() => {
        autoUpdater.checkForUpdates();
    }, 5000);
}

function checkForUpdates(menuItem, focusedWindow, event) {
    updater = menuItem;
    updater.enabled = false;
    autoUpdater.checkForUpdates();
}

function createUpdateDialog(info) {
    if (updateWindow == null) {
        updateWindow = true;
        dialog.showMessageBox(win, {
            type: "info",
            title: 'Software Update',
            message: 'A new version of autoupdate is available!',
            detail: `Autoupdate ${info.version} is now available\u2014you have ${autoUpdater.currentVersion}. Would you like to download it now?`,
            buttons: ['Yes', 'Remind me Later']
        }).then((buttonIndex: any) => {
            log.info('buttonIndex', buttonIndex)
            if (buttonIndex.response === 0) {
                startDownload();
            } else {
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
    log.info('strat download')
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
    autoUpdater.downloadUpdate();
}

function ensureSafeQuitAndInstall() {
    app.removeAllListeners('window-all-closed');
    var browserWindows = BrowserWindow.getAllWindows();
    browserWindows.forEach(function (browserWindow) {
        browserWindow.removeAllListeners('close');
    });
    setImmediate(() => { autoUpdater.quitAndInstall(); })
}

app.on('ready', () => {
    Menu.setApplicationMenu(appMenu);
    createWindow();
    startUpdateTimer();
    // autoUpdater.checkForUpdatesAndNotify();
})

autoUpdater.on('update-available', (info) => {
    log.info('update-available');
    log.info('version', info.version);
    log.info('release date', info.releaseDate);
    if (updater == null) {
        notification = new Notification({ title: 'A new version is ready to download', body: `${app.getName()} version ${info.version} can be downloaded and installed` });

        notification.on('click', () => {
            createUpdateDialog(info);
        });
        notification.show();
    } else {
        createUpdateDialog(info);
    }
})

autoUpdater.on('checking-for-update', () => {
    log.info('checking-for-update');
})

autoUpdater.on('download-progress', (progress) => {
    // showNotification("New version detected, downloading, please wait" + progress.percent);
    win.setProgressBar(progress.percent);
    downloadPercent = progress.percent;
    log.info('download-progress', progress.percent);
})

autoUpdater.on('update-downloaded', () => {
    log.info('update-downloaded');
    showNotification('Download Complete', 'Download Complete');
    progressBar.setCompleted();
    progressBar.close();

    dialog.showMessageBox(win, {
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

autoUpdater.on('update-not-available', () => {
    log.info('update-not-available');
    showNotification('No update found.', 'Application up-to-date');
})

autoUpdater.on('error', (err) => {
    log.info('error', err);
})

ipcMain.on('get-items', async (event: any) => {
    try {
        event.returnValue = app.getVersion();
    } catch (err) {
        throw err;
    }
});