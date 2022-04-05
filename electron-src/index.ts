// Native
import { join } from 'path';
import { format } from 'url';

// Packages
import { app, BrowserWindow, ipcMain, IpcMainEvent, session } from 'electron';
import isDev from 'electron-is-dev';
import prepareNext from 'electron-next';
import os from 'os';
import fs from 'fs';

require('electron-reload')(__dirname, {
  electron: require('${__dirname}/../../node_modules/electron'),
});

/* 
  Return true when a is more latest version than b.
  Version is formatted e.g. "4.23.0_0"
*/
const compareVersion = (a: string, b: string): boolean => {
  if (a === b) {
    return true;
  }

  // separators include "." and "_"
  const aUnits = a.split(/.|_/);
  const bUnits = b.split(/.|_/);

  const len = Math.min(aUnits.length, bUnits.length);

  for (var i = 0; i < len; i++) {
    if (parseInt(aUnits[i]) >= parseInt(bUnits[i])) return true;
    if (parseInt(aUnits[i]) < parseInt(bUnits[i])) return false;
  }

  // if unit elements are the same, choose the one with more units
  if (aUnits.length >= bUnits.length) return true;
  return aUnits.length >= bUnits.length;
};

const reactDevToolsPath = () => {
  const dirPath = join(
    os.homedir(),
    '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/',
  );
  const versions = fs.readdirSync(dirPath);
  return join(
    dirPath,
    Array.from(versions).reduce((accumulator, currentValue) => {
      return compareVersion(accumulator, currentValue) ? accumulator : currentValue;
    }),
  );
};

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer');
  await session.defaultSession.loadExtension(reactDevToolsPath());

  const mainWindow = new BrowserWindow({
    show: false,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, 'preload.js'),
    },
  });

  mainWindow.maximize();
  mainWindow.show();

  mainWindow.webContents.setVisualZoomLevelLimits(1, 4);

  const url = isDev
    ? 'http://localhost:8000/'
    : format({
        pathname: join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
      });

  mainWindow.loadURL(url);

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.insertCSS(
      fs.readFileSync(join(__dirname, '../renderer/style/style.css'), 'utf8'),
    );
  });
});

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send('message', 'hi from electron'), 500);
});
