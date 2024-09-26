document.addEventListener("mousemove", (event) => {
  const trail = document.createElement("div");
  trail.className = "trail";
  trail.style.left = `${event.pageX}px`;
  trail.style.top = `${event.pageY}px`;
  document.body.appendChild(trail);

  setTimeout(() => {
    trail.remove();
  }, 1000);
});

const style = document.createElement("style");
style.innerHTML = `
    .trail {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet);
        pointer-events: none;
    }
`;
document.head.appendChild(style);
