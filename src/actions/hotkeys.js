export function undoRedo(node, { undo, redo }) {
  function handleKeydown(event) {
    if ((event.metaKey || event.ctrlKey) && (event.key === 'z' || event.key === 'Z')) {
      event.preventDefault();
      event.shiftKey ? redo() : undo();
    }
  }
  node.addEventListener('keydown', handleKeydown);
  return ({
    destroy() {
      node.removeEventListener('keydown', handleKeydown);
    }
  })
}