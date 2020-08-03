/**
 * Provide dynamic input type of text/password.
 *
 * When focused, the bottom border will be highlighted a primary color. If there
 * is an error condition, the bottom border will be highlighted an error color.
 * @param {HTMLElement} node The input element.
 * @param {{
 *   isPassword: boolean,
 *   focused: boolean,
 * }} actionOptions
 * @param actionOptions.isPassword Whether the input is a password type. This
 * allows binding value while allowing input type to be dynamic between text and
 * password.
 * @param actionOptions.focused Whether the input element is focused.
 */
export function inputAction(node, { isPassword, focused, showError }) {
  if (isPassword) {
    node.type = 'password';
  }
  if (focused) {
    node.focus();
    focus();
  }
  if (showError) {
    error();
  }
  function normal() {
    node.style.border = '1px solid transparent';
  }
  function focus() {
    node.style.border = '1px solid var(--primary-500)';
  }
  function error() {
    node.style.border = '1px solid var(--error-500)';
  }
  return {
    update({ focused: newFocused, showError: newShowError }) {
      if (newFocused) {
        focus();
      } else {
        normal();
      }
      if (newShowError) error();
    },
  };
}

/**
 * When focused, or when the value is not empty, the label will shift upwards
 * and be highlited a primary color. If there is an error condition, the label
 * will be highlighted an error color.
 * @param {HTMLElement} node The input label element.
 */
export function labelAction(node, { focused, value, showError, focusOnMount }) {
  function normal() {
    node.style.fontSize = '1em';
    node.style.top = '0.8em';
    node.style.color = 'var(--text-400)';
  }
  function focus() {
    node.style.fontSize = '0.7em';
    node.style.top = '0.3em';
    node.style.color = 'var(--primary-500)';
  }
  function error() {
    node.style.color = 'var(--error-500)';
  }

  const nonEmpty = value && value.length !== 0;
  if (focused || nonEmpty || focusOnMount) {
    focus();
  } else {
    normal();
  }
  if (showError) error();

  return {
    update({ focused: newFocused, value: newValue, showError: newShowError }) {
      const newNonEmpty = newValue && newValue.length !== 0;
      if (newFocused || newNonEmpty) {
        focus();
      } else {
        normal();
      }
      if (newShowError) error();
    },
  };
}
