const sidebar = document.getElementById("sidebar");
const webview = document.getElementById("webview");
const searchOverlay = document.getElementById("search-overlay");
const searchInput = document.getElementById("search-input");
const backBtn = document.getElementById("back-btn");
const forwardBtn = document.getElementById("forward-btn");
const refreshBtn = document.getElementById("refresh-btn");
const catPopup = document.getElementById("cat-popup");
const closeCatBtn = document.getElementById("close-cat");
const themeToggle = document.getElementById("theme-toggle");

let tabs = [];
let activeTab = null;
const themes = [
  "light",
  "dark",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
];
let currentThemeIndex = 0;

function createTab(url) {
  const tab = { id: Date.now(), url: url, title: "New Tab" };
  tabs.push(tab);
  renderTabs();
  switchToTab(tab.id);
}

function renderTabs() {
  sidebar.innerHTML = "";
  tabs.forEach((tab) => {
    const tabElement = document.createElement("div");
    tabElement.className = "tab";
    tabElement.textContent = tab.title;
    tabElement.onclick = () => switchToTab(tab.id);
    sidebar.appendChild(tabElement);
  });
}

function switchToTab(tabId) {
  activeTab = tabs.find((tab) => tab.id === tabId);
  webview.src = activeTab.url;
  shuffleTabs();
}

function shuffleTabs() {
  tabs = tabs.sort(() => Math.random() - 0.5);
  renderTabs();
}

function loadHomepage() {
  webview.src =
    'data:text/html,<html><body style="margin:0;padding:0;height:100vh;display:flex;justify-content:center;align-items:center;background-image:url(../assets/wow.gif);background-repeat:repeat;"><div style="font-family:Comic Sans MS,cursive;font-size:24px;color:black;background-color:rgba(255,255,255,0.7);padding:20px;border-radius:10px;">Press Ctrl+Q to search for websites</div></body></html>';
}

// Event listeners
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "q") {
    searchOverlay.classList.toggle("hidden");
    searchInput.focus();
  } else if (e.ctrlKey && e.key === "l" && activeTab) {
    closeTab(activeTab.id);
  }
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const searchTerm = searchInput.value;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      searchTerm
    )}`;
    createTab(searchUrl);
    searchOverlay.classList.add("hidden");
    searchInput.value = "";
  }
});

backBtn.addEventListener("click", () => webview.goBack());
forwardBtn.addEventListener("click", () => webview.goForward());
refreshBtn.addEventListener("click", () => webview.reload());

closeCatBtn.addEventListener("click", () => {
  catPopup.classList.add("hidden");
  createTab("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
});

themeToggle.addEventListener("click", () => {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  window.electronAPI.setTheme(themes[currentThemeIndex]);
});

// Rainbow cursor trail
const trailLength = 200;
const segmentSize = 20;
const trail = [];
let hue = 0;

document.addEventListener("mousemove", (e) => {
  trail.push({ x: e.clientX, y: e.clientY });
  if (trail.length > trailLength) {
    trail.shift();
  }
  updateTrail();
});

function updateTrail() {
  const trailElement = document.getElementById("cursor-trail");
  if (!trailElement) {
    const newTrailElement = document.createElement("div");
    newTrailElement.id = "cursor-trail";
    document.body.appendChild(newTrailElement);
  }

  let trailHTML = "";
  trail.forEach((segment, index) => {
    const opacity = 1 - index / trailLength;
    const segmentHue = (hue + index * 2) % 360;
    trailHTML += `<div style="position:absolute;left:${segment.x}px;top:${segment.y}px;width:${segmentSize}px;height:${segmentSize}px;border-radius:50%;background-color:hsla(${segmentHue},100%,50%,${opacity});pointer-events:none;"></div>`;
  });

  document.getElementById("cursor-trail").innerHTML = trailHTML;
  hue = (hue + 1) % 360;
  requestAnimationFrame(updateTrail);
}

// Initialize
loadHomepage();

// Handle messages from the main process
window.electronAPI.onShowCatPopup(() => {
  catPopup.classList.remove("hidden");
});

window.electronAPI.onThemeChanged((theme) => {
  document.body.className = theme;
});

// Get initial theme
window.electronAPI.getTheme();
