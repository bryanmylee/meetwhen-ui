export function inputAction(node, options) {
  if (options.isPassword) {
    node.type = 'password';
  }
}

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

export function barAction(node) {
  function normal() {
    node.style.backgroundColor = 'var(--primary-1)';
    node.style.width = 0;
  }
  function focus() {
    node.style.width = '100%';
  }
  function error() {
    node.style.backgroundColor = 'var(--error-0)';
    node.style.width = '100%';
  }
  return ({
    update({ focused, showError }) {
      normal();
      if (focused) focus();
      if (showError) error();
    }
  });
}