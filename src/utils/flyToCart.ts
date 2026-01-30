export const flyToCart = (sourceEl: HTMLElement) => {
  const cart = document.getElementById("cart-icon");
  if (!cart) return;

  const img = sourceEl.querySelector("img") as HTMLImageElement;
  if (!img) return;

  const imgRect = img.getBoundingClientRect();
  const cartRect = cart.getBoundingClientRect();

  const clone = img.cloneNode(true) as HTMLImageElement;
  clone.style.position = "fixed";
  clone.style.left = imgRect.left + "px";
  clone.style.top = imgRect.top + "px";
  clone.style.width = imgRect.width + "px";
  clone.style.height = imgRect.height + "px";
  clone.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
  clone.style.zIndex = "9999";
  clone.style.borderRadius = "12px";

  document.body.appendChild(clone);

  requestAnimationFrame(() => {
    clone.style.left = cartRect.left + "px";
    clone.style.top = cartRect.top + "px";
    clone.style.width = "20px";
    clone.style.height = "20px";
    clone.style.opacity = "0.5";
  });

  setTimeout(() => {
    document.body.removeChild(clone);
  }, 800);
};
