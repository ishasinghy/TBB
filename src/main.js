const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
let store;

(async () => {
  const Store = await import("electron-store");
  store = new Store.default();
})();

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "../assets/logo.png"),
  });

  win.loadFile(path.join(__dirname, "index.html"));
  win.webContents.setZoomFactor(1.05); // 5% zoom

  // Implement cat popup every 15 minutes
  setInterval(() => {
    const catImages = fs
      .readdirSync(path.join(__dirname, "../assets/catroll"))
      .filter((file) => file.startsWith("cat") && file.endsWith(".png"));
    const randomCat = catImages[Math.floor(Math.random() * catImages.length)];
    win.webContents.send("show-cat-popup", randomCat);
  }, 1000); //15 * 60 *
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("get-theme", (event) => {
  event.reply("theme-changed", store.get("theme", "light"));
});

ipcMain.on("set-theme", (event, theme) => {
  store.set("theme", theme);
  event.reply("theme-changed", theme);
});
