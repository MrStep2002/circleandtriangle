(function () {
  if (location.pathname.endsWith("/index.html") || location.pathname.endsWith("/")) return;
  const link = document.createElement("a");
  link.href = "index.html";
  link.textContent = "← Home";
  link.setAttribute("aria-label", "Back to all games");
  Object.assign(link.style, {
    position: "fixed",
    top: "10px",
    left: "10px",
    zIndex: "1000",
    padding: "7px 11px",
    borderRadius: "999px",
    background: "rgba(255,255,255,.94)",
    color: "#2C5C42",
    font: "700 14px Nunito, system-ui, sans-serif",
    textDecoration: "none",
    boxShadow: "0 2px 6px rgba(38,49,42,.14)"
  });
  document.body.appendChild(link);
}());
