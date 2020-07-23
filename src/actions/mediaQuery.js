/**
 * Attach a media query to the window element.
 * @param {HTMLElement} node The action node.
 * @param {{
 *   query: string,
 *   callback: (matches: boolean) => any
 * }} actionOptions
 * @param actionOptions.query The media query to attach to the window node.
 * @param actionOptions.callback The callback function called when the media
 * query changes state. The callback is called with the state of whether the
 * media query matches.
 */
export default function mediaQuery(node, { query, callback }) {
  const media = node.matchMedia(query);
  callback(media.matches);
  media.addListener((event) => callback(event.matches));
  return {
    destroy() {
      media.removeListener((event) => callback(event.matches));
    },
  };
}
