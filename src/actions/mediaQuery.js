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
  if (node.matchMedia == null) {
    return {};
  }

  const media = node.matchMedia(query);
  callback(media.matches);

  function handleMediaUpdate(event) {
    callback(event.matches);
  }

  media.addListener(handleMediaUpdate);
  return {
    destroy() {
      media.removeListener(handleMediaUpdate);
    },
  };
}

/**
 * Attach multiple media queries to the window element.
 * @param {HTMLElement} node The action node.
 * @param {{
 *  queries: string[],
 *  callbacks: ((matches: boolean) => void)[]
 * }} actionOptions
 * @param actionOptions.queries An array of media queries to attach to the window node.
 * @param actionOptions.callbacks An array of callback function called when the same indexed media
 * queries changes state. The callback is called with the state of whether the media query matches.
 */
export function mediaQueries(node, { queries, callbacks }) {
  if (node.matchMedia == null) {
    return {};
  }

  const medias = queries.map((query) => node.matchMedia(query));
  medias.forEach((media, i) => callbacks[i](media.matches));

  const handlers = callbacks.map((callback) => (event) => {
    callback(event.matches);
  });

  medias.forEach((media, i) => {
    media.addListener(handlers[i]);
  });
  return {
    destroy() {
      medias.forEach((media, i) => {
        media.removeListener(handlers[i]);
      });
    },
  };
}
