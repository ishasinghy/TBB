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
  const tab = { id: Date.now(), url: url, title: "Loading..." };
  tabs.push(tab);
  renderTabs();
  switchToTab(tab.id);
}

function renderTabs() {
  sidebar.innerHTML = "";
  tabs.forEach((tab) => {
    const tabElement = document.createElement("div");
    tabElement.className = "tab";
    tabElement.innerHTML = `
      <div class="tab-title">${tab.title}</div>
      <div class="tab-url">${tab.url}</div>
    `;
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

function closeTab(tabId) {
  tabs = tabs.filter((tab) => tab.id !== tabId);
  if (tabs.length === 0) {
    loadHomepage();
  } else {
    switchToTab(tabs[0].id);
  }
  renderTabs();
}

function loadHomepage() {
  webview.src = "about:blank";
  document.getElementById("homepage").style.display = "flex";
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
    const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(
      searchTerm
    )}`;
    createTab(searchUrl);
    searchOverlay.classList.add("hidden");
    searchInput.value = "";
    document.getElementById("homepage").style.display = "none";
  }
});

backBtn.addEventListener("click", () => webview.goBack());
forwardBtn.addEventListener("click", () => webview.goForward());
refreshBtn.addEventListener("click", () => webview.reload());

closeCatBtn.addEventListener("click", () => {
  catPopup.classList.add("hidden");
  createTab("https://youtu.be/w_uo3FyGN3k?si=yFzurE0Jz4dUX68A");
});

themeToggle.addEventListener("click", () => {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  window.electronAPI.setTheme(themes[currentThemeIndex]);
});

// Rainbow cursor trail
const trail = [];
const trailLength = 20;

document.addEventListener("mousemove", (e) => {
  const dot = document.createElement("div");
  dot.className = "trail";
  dot.style.left = e.pageX + "px";
  dot.style.top = e.pageY + "px";
  document.body.appendChild(dot);

  trail.push(dot);

  if (trail.length > trailLength) {
    document.body.removeChild(trail.shift());
  }

  trail.forEach((dot, index) => {
    const hue = (index * 15) % 360;
    dot.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
    dot.style.opacity = 1 - index / trailLength;
  });
});

// Initialize
loadHomepage();

// Handle messages from the main process
window.electronAPI.onShowCatPopup((catImage) => {
  catPopup.querySelector("img").src = `../assets/catroll/${catImage}`;

  // Randomize the position of the cat popup
  const maxX = window.innerWidth - 200; // 200px is an approximate width of the popup
  const maxY = window.innerHeight - 200; // 200px is an approximate height of the popup
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  catPopup.style.left = `${randomX}px`;
  catPopup.style.top = `${randomY}px`;
  catPopup.style.transform = "none"; // Remove the centering transform

  catPopup.classList.remove("hidden");
});

window.electronAPI.onThemeChanged((theme) => {
  document.body.className = theme;
});

// Get initial theme
window.electronAPI.getTheme();

// Update tab title when page loads
webview.addEventListener("did-start-loading", () => {
  if (activeTab) {
    activeTab.title = "Loading...";
    renderTabs();
  }
});

webview.addEventListener("did-stop-loading", () => {
  if (activeTab) {
    activeTab.title = webview.getTitle();
    activeTab.url = webview.getURL();
    renderTabs();
    if (webview.getURL().indexOf("duckduckgo.com") === -1) {
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      window.electronAPI.setTheme(themes[currentThemeIndex]);
    }
  }
});

// Fun feature: Randomly rotate content
function startShaking() {
  const angle = Math.random() * 10 - 5; // Random angle between -5 and 5 degrees
  webview.style.transform = `rotate(${angle}deg)`;
  setTimeout(startShaking, Math.random() * 5000 + 1000); // Random interval between 1-6 seconds
}

startShaking();

// Fun feature: Occasionally invert colors
setInterval(() => {
  if (Math.random() < 0.1) {
    // 10% chance every 10 seconds
    webview.style.filter = "invert(100%)";
    setTimeout(() => {
      webview.style.filter = "none";
    }, 10000);
  }
}, 10000);
