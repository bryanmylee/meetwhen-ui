import DoubleSlider from 'double-slider';

export default function doubleSlider(node, { min, max, range }) {
  setValues(min, max, range);

  function setValues(min, max, range) {
    node.setAttribute('data-min', min);
    node.setAttribute('data-max', max);
    node.setAttribute('data-range', range);
  }

  const slider = new DoubleSlider(node);

  slider.addEventListener('slider:change', _ => {
    const { min, max } = slider.value;
    console.log({ min, max });
  })
}