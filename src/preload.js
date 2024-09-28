// const { contextBridge, ipcRenderer } = require("electron");

// contextBridge.exposeInMainWorld("electronAPI", {
//   setTheme: (theme) => ipcRenderer.send("set-theme", theme),
//   getTheme: () => ipcRenderer.send("get-theme"),
//   onThemeChanged: (callback) =>
//     ipcRenderer.on("theme-changed", (event, theme) => callback(theme)),
//   onShowCatPopup: (callback) =>
//     ipcRenderer.on("show-cat-popup", (event, catImage) => callback(catImage)),
// });
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  setTheme: (theme) => ipcRenderer.send("set-theme", theme),
  getTheme: () => ipcRenderer.send("get-theme"),
  onThemeChanged: (callback) =>
    ipcRenderer.on("theme-changed", (event, theme) => callback(theme)),
  onShowCatPopup: (callback) =>
    ipcRenderer.on("show-cat-popup", (event, catImage) => callback(catImage)),
  // setZoomFactor: (factor) => ipcRenderer.send("set-zoom-factor", factor),
});

// contextBridge.exposeInMainWorld("webview", {
//   setZoomFactor: (factor) => {
//     const webview = document.querySelector("webview");
//     if (webview) {
//       webview.setZoomFactor(factor);
//     }
//   },
// });
