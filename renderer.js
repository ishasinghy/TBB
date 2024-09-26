const { ipcRenderer } = require("electron");

const tabsContainer = document.getElementById("tabs");
const searchBar = document.getElementById("search-bar");
const searchInput = document.getElementById("search-input");
const catPopup = document.getElementById("cat-popup");

// Tab shuffling and creation
let tabCount = 0;
function addTab(url, title) {
  const tab = document.createElement("div");
  tab.textContent = title || "New Tab";
  tab.onclick = () => {
    shuffleTabs();
    loadPage(url);
  };
  tabsContainer.appendChild(tab);
}

function shuffleTabs() {
  const tabs = Array.from(tabsContainer.children);
  tabs.sort(() => Math.random() - 0.5);
  tabs.forEach((tab) => tabsContainer.appendChild(tab));
}

// Open the search bar with Ctrl + Q
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "q") {
    searchBar.classList.toggle("hidden");
  }
});

// Perform search and load page
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const searchQuery = searchInput.value;
    const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
    addTab(searchUrl, searchQuery);
    loadPage(searchUrl);
    searchBar.classList.add("hidden");
  }
});

// Page loading
function loadPage(url) {
  document.getElementById(
    "browser-content"
  ).innerHTML = `<iframe src="${url}" style="width: 100%; height: 100%;"></iframe>`;
}

// Cat popup logic
ipcRenderer.on("popup-cat", () => {
  catPopup.classList.remove("hidden");
});

catPopup.onclick = () => {
  ipcRenderer.send("rickroll");
  catPopup.classList.add("hidden");
};

// Theme toggle
const themeToggle = document.getElementById("theme-toggle");
const themes = [
  "light",
  "dark",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "violet",
];
let currentTheme = 0;

themeToggle.addEventListener("click", () => {
  document.body.className = themes[currentTheme];
  currentTheme = (currentTheme + 1) % themes.length;
});
