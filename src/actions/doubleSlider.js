import DoubleSlider from 'double-slider';

export default function doubleSlider(node, { min, max, range }) {
  setValues(min, max, range);

  function setValues(min, max, range) {
    node.setAttribute('data-min', min);
    node.setAttribute('data-max', max);
    node.setAttribute('data-range', range);
  }

  const slider = new DoubleSlider(node);

  slider.addEventListener('slider:input', dispatchInput);
  slider.addEventListener('slider:change', dispatchChange);
  slider.layout();

  function dispatchInput() {
    const { min, max } = slider.value;
    node.dispatchEvent(new CustomEvent('sliderInput', {
      detail: { min, max },
    }));
  }

  function dispatchChange() {
    const { min, max } = slider.value;
    node.dispatchEvent(new CustomEvent('sliderChange', {
      detail: { min, max },
    }));
  }

  return ({
    update({ min, max, range }) {
      setValues(min, max, range);
    },
    destroy() {
      slider.removeEventListener('slider:change', dispatchChange)
      slider.removeEventListener('slider:input', dispatchInput)
    }
  })
}