const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  setTheme: (theme) => ipcRenderer.send("set-theme", theme),
  getTheme: () => ipcRenderer.send("get-theme"),
  onThemeChanged: (callback) =>
    ipcRenderer.on("theme-changed", (event, theme) => callback(theme)),
  onShowCatPopup: (callback) =>
    ipcRenderer.on("show-cat-popup", (event, catImage) => callback(catImage)),
});
