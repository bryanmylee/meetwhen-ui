const FRAME_DURATION = 16.7;

export default async function nextFrame() {
  return new Promise((res) => {
    setTimeout(res, FRAME_DURATION);
  });
}
