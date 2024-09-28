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
let isStupidFeaturesEnabled = true;

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

// Cursor Chaos
function cursorChaos() {
  const maxX = window.innerWidth;
  const maxY = window.innerHeight;
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);
  const fakeCursor = document.createElement("div");
  fakeCursor.style.position = "fixed";
  fakeCursor.style.left = `${randomX}px`;
  fakeCursor.style.top = `${randomY}px`;
  fakeCursor.style.width = "20px";
  fakeCursor.style.height = "20px";
  fakeCursor.style.backgroundColor = "black";
  fakeCursor.style.borderRadius = "50%";
  fakeCursor.style.zIndex = "9999";
  document.body.appendChild(fakeCursor);
  setTimeout(() => document.body.removeChild(fakeCursor), 2000);
}

// Zoom Madness
function zoomMadness() {
  const zoomLevels = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const randomZoom = zoomLevels[Math.floor(Math.random() * zoomLevels.length)];
  webview.setZoomFactor(randomZoom);
  setTimeout(() => webview.setZoomFactor(1), 5000); // Reset zoom after 5 seconds
}

// Noisy Navigation
const navigationSounds = [
  "../assets/sounds/beep.mp3",
  "../assets/sounds/boop.mp3",
  "../assets/sounds/ding.mp3",
  "../assets/sounds/dong.mp3",
];

function playRandomSound() {
  const randomSound =
    navigationSounds[Math.floor(Math.random() * navigationSounds.length)];
  const audio = new Audio(randomSound);
  audio.play();
}

// Fake Loading Overlay
function fakeLoadingOverlay() {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "10000";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.color = "white";
  overlay.style.fontSize = "24px";
  overlay.innerText = "Loading... Please wait...";
  document.body.appendChild(overlay);
  setTimeout(() => document.body.removeChild(overlay), 3000);
}

// Keyboard Konfusion
const originalKeyHandler = document.onkeydown;
function keyboardKonfusion(event) {
  const confusedKeys = {
    e: "r",
    r: "e",
    a: "s",
    s: "a",
    t: "y",
    y: "t",
  };
  if (confusedKeys[event.key]) {
    event.preventDefault();
    const newEvent = new KeyboardEvent("keydown", {
      key: confusedKeys[event.key],
      code: event.code,
      which: event.which,
      keyCode: event.keyCode,
      bubbles: true,
      cancelable: true,
    });
    event.target.dispatchEvent(newEvent);
  } else {
    originalKeyHandler && originalKeyHandler(event);
  }
}

// Random feature trigger
function triggerRandomFeature() {
  if (!isStupidFeaturesEnabled) return;

  const features = [cursorChaos, zoomMadness, fakeLoadingOverlay];
  const randomFeature = features[Math.floor(Math.random() * features.length)];
  randomFeature();
}

// Event listeners
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "q") {
    searchOverlay.classList.toggle("hidden");
    searchInput.focus();
  } else if (e.ctrlKey && e.key === "l" && activeTab) {
    closeTab(activeTab.id);
  } else if (e.ctrlKey && e.key === "b") {
    isStupidFeaturesEnabled = !isStupidFeaturesEnabled;
    if (isStupidFeaturesEnabled) {
      document.onkeydown = keyboardKonfusion;
    } else {
      document.onkeydown = originalKeyHandler;
      webview.setZoomFactor(1); // Reset zoom when disabling features
    }
    console.log(
      `Stupid features ${isStupidFeaturesEnabled ? "enabled" : "disabled"}`
    );
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
  playRandomSound();
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
    }, 1000);
  }
}, 10000);

// Trigger a random feature every 2 minutes
setInterval(triggerRandomFeature, 2 * 60 * 1000);
// // Fun feature: Randomly rotate content
// function startShaking() {
//   const angle = Math.random() * 10 - 5; // Random angle between -5 and 5 degrees
//   webview.style.transform = `rotate(${angle}deg)`;
//   setTimeout(startShaking, Math.random() * 5000 + 1000); // Random interval between 1-6 seconds
// }

// startShaking();

// // Fun feature: Occasionally invert colors
// setInterval(() => {
//   if (Math.random() < 0.1) {
//     // 10% chance every 10 seconds
//     webview.style.filter = "invert(100%)";
//     setTimeout(() => {
//       webview.style.filter = "none";
//     }, 10000);
//   }
// }, 10000);
