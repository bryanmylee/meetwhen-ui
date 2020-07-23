/**
 * Attaches an undo and redo function to their keyboard shortcuts.
 * @param {HTMLElement} node The action node.
 * @param {{
 *   undo: Function,
 *   redo: Function,
 * }} actionOptions
 * @param actionOptions.undo The undo function to bind to Ctrl/Cmd+Z
 * @param actionOptions.redo The redo function to bind to Shift+Ctrl/Cmd+Z
 */
export function undoRedo(node, { undo, redo }) {
  function handleKeydown(event) {
    if ((event.metaKey || event.ctrlKey) && (event.key === 'z' || event.key === 'Z')) {
      event.preventDefault();
      if (event.shiftKey) {
        redo();
      } else {
        undo();
      }
    }
  }
  node.addEventListener('keydown', handleKeydown);
  return {
    destroy() {
      node.removeEventListener('keydown', handleKeydown);
    },
  };
}
