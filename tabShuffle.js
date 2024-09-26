function shuffleTabs() {
  const sidebar = document.getElementById("sidebar");
  const tabs = Array.from(sidebar.children);

  for (let i = tabs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tabs[i], tabs[j]] = [tabs[j], tabs[i]];
  }

  // Reattach shuffled tabs
  tabs.forEach((tab) => sidebar.appendChild(tab));
}
