import { app, BrowserWindow, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

let mainWindow: BrowserWindow;

(async () => {
  await app.whenReady();

  mainWindow = createWindow('main', {
    width: 1920,
    height: 1080,
    minWidth: 1280,
    minHeight:720,
    // backgroundColor: '#2C3333',
    transparent: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
