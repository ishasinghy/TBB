const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("index.html");
  win.webContents.on("did-finish-load", () => {
    setTimeout(() => {
      win.webContents.send("popup-cat");
    }, 900000); // 15 minutes
  });
}

app.on("ready", createWindow);

ipcMain.on("rickroll", () => {
  win.loadURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
});
