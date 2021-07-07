const useScreenHeight = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  window.addEventListener('resize', updateDocument);
  updateDocument();
};

const updateDocument = (): void => {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
};

useScreenHeight();

export {};
