export function fastclick(node) {
  function handle(e) {
    const validMouseDown = e.type === "mousedown" && e.buttons === 1;
    const validKeyDown = e.type === "keydown" && (e.key === " " || e.key === "Enter");
    if (validMouseDown || validKeyDown) {
      e.stopPropagation();
      node.dispatchEvent(new CustomEvent("fastclick", { clientX: e.clientX, clientY: e.clientY }));
    }
  }
  
  node.addEventListener("mousedown", handle);
  node.addEventListener("keydown", handle);
  
  return {
    destroy() {
      node.removeEventListener("mousedown", handle);
      node.removeEventListener("keydown", handle);
    }
  }
}
