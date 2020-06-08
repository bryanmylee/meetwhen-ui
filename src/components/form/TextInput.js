/**
 * Provide dynamic input type of text/password.
 *
 * When focused, the bottom border will be highlighted a primary color. If there
 * is an error condition, the bottom border will be highlighted an error color.
 * @param {HTMLElement} node The input element.
 * @param {{ isPassword: boolean }} actionOptions
 * @param actionOptions.isPassword Whether the input is a password type. This
 * allows binding value while allowing input type to be dynamic between text and
 * password.
 */
export function inputAction(node, { isPassword }) {
  if (isPassword) {
    node.type = 'password';
  }
  function normal() {
    node.style.borderBottom = '1px solid var(--line-1)';
  }
  function focus() {
    node.style.borderBottom = '1px solid var(--primary-1)';
  }
  function error() {
    node.style.borderBottom = '1px solid var(--error-0)';
  }
  return ({
    update({ focused, showError }) {
      if (focused) {
        focus();
      } else {
        normal();
      }
      if (showError) error();
    }
  });
}

/**
 * When focused, or when the value is not empty, the label will shift upwards
 * and be highlited a primary color. If there is an error condition, the label
 * will be highlighted an error color.
 * @param {HTMLElement} node The input label element.
 */
export function labelAction(node) {
  function normal() {
    node.style.fontSize = '1em';
    node.style.top = '10px';
    node.style.color = 'var(--text-3)';
  }
  function focus() {
    node.style.fontSize = '0.8em';
    node.style.top = '-0.6em';
    node.style.color = 'var(--primary-1)';
  }
  function error() {
    node.style.color = 'var(--error-0)';
  }
  return ({
    update({ focused, value, showError }) {
      if (focused || (value && value.length !== 0)) {
        focus();
      } else {
        normal();
      }
      if (showError) error();
    }
  });
}