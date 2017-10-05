// React 16 complains if you don't have requestAnimationFrame
// See https://github.com/facebook/jest/issues/4545
global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0);
};
