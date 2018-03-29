import { app, BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';

export const initElectron = () => {
  let mainWindow;

  console.log(__dirname);

  const createWindow = () => {
    mainWindow = new BrowserWindow({ width: 800, height: 600 });

    mainWindow.loadURL(url.format({
      pathname: path.resolve(__dirname, '../../build/index.html'), // XXX
      protocol: 'file:',
      slashes: true,
    }));

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  };

  app.on('ready', createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
};
