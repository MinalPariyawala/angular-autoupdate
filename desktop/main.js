"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.win = void 0;
const electron_1 = require("electron");
const path = require("path");
const electron_updater_1 = require("electron-updater");
const log = require("electron-log");
log.transports.file.resolvePath = () => path.join('C:/Users/Administrator/Desktop/minal/angular-autoupdate/', 'logs/main.log');
log.info('application version:', electron_1.app.getVersion());
log.info('hello');
function createWindow() {
    exports.win = new electron_1.BrowserWindow({
        width: 300, height: 400
    });
    exports.win.loadURL('http://localhost:4201');
    // win.loadFile(path.join(__dirname, 'src/index.html'));
}
electron_1.app.on('ready', () => {
    createWindow();
    electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
});
electron_updater_1.autoUpdater.on('update-available', () => {
    log.info('update-available');
});
electron_updater_1.autoUpdater.on('checking-for-update', () => {
    log.info('checking-for-update');
});
electron_updater_1.autoUpdater.on('download-progress', (progress) => {
    log.info('download-progress', progress);
});
electron_updater_1.autoUpdater.on('update-downloaded', () => {
    log.info('update-downloaded');
    setImmediate(() => {
        electron_updater_1.autoUpdater.quitAndInstall();
    });
});
electron_updater_1.autoUpdater.on('update-not-available', () => {
    log.info('update-not-available');
});
electron_updater_1.autoUpdater.on('error', (err) => {
    log.info('error', err);
});
//# sourceMappingURL=main.js.map