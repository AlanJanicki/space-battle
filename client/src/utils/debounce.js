export const debounce = (fn, delay) => {
  let timer;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
};
