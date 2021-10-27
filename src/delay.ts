export const delay = (seconds: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), seconds * 1000);
  });
};

export const delaySync = (seconds: number): void => {
  let timestamp = Date.now();
  while (true) {
    if (Date.now() - timestamp >= seconds * 1000) {
      return;
    }
  }
};
