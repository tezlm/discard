export function fastclick(node: Node) {
  function handle(e) {
    const validMouseDown = e.type === "mousedown" && e.buttons === 1;
    const validKeyDown = e.type === "keydown" && (e.key === " " || e.key === "Enter");
    if (validMouseDown || validKeyDown) {
      e.stopPropagation();
      e.preventDefault();
      node.dispatchEvent(new CustomEvent(e.buttons === 2 ? "fastcontext" : "fastclick", {
        detail: {
          x: e.clientX,
          y: e.clientY,
          shift: e.shiftKey,
          ctrl: e.ctrlKey,
          alt: e.altKey,
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
