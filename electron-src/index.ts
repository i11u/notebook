// Native
import { join } from 'path';
import { format } from 'url';

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent, session } from 'electron';
import isDev from 'electron-is-dev';
import prepareNext from 'electron-next';
import os from 'os';
import fs from 'fs';

require('electron-reload')(__dirname, {
  electron: require('${__dirname}/../../node_modules/electron'),
});

const reactDevToolsPath = join(
  os.homedir(),
  '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.22.0_0',
);

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer');
  await session.defaultSession.loadExtension(reactDevToolsPath);

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
