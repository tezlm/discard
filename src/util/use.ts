export function fastclick(node) {
  function handle(e) {
    const validMouseDown = e.type === "mousedown" && e.buttons === 1;
    const validKeyDown = e.type === "keydown" && (e.key === " " || e.key === "Enter");
    if (validMouseDown || validKeyDown) {
      e.stopPropagation();
      node.dispatchEvent(new CustomEvent("fastclick", {
        detail: {
          clientX: e.clientX,
          clientY: e.clientY,
          shiftKey: e.shiftKey,
          ctrlKey: e.ctrlKey,
          altKey: e.altKey,
        }
      }));
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
