(() => {
  const startedAt = performance.now();
  const minimumDisplayTime = 450;
  let finished = false;

  const finishLoading = () => {
    if (finished) return;
    finished = true;
    const wait = Math.max(0, minimumDisplayTime - (performance.now() - startedAt));
    setTimeout(() => document.body.classList.remove("app-loading"), wait);
  };

  window.finishPortfolioLoading = finishLoading;
  setTimeout(finishLoading, 4000);
  window.addEventListener("error", (event) => {
    if (event.target instanceof HTMLScriptElement) finishLoading();
  }, true);
  window.addEventListener("unhandledrejection", finishLoading);
})();
