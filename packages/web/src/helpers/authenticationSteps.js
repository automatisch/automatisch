const parseUrlSearchParams = (event) => {
  const searchParams = new window.URLSearchParams(event.data.payload.search);
  const hashParams = new window.URLSearchParams(
    event.data.payload.hash.substring(1),
  );
  const searchParamsObject = getObjectOfEntries(searchParams.entries());
  const hashParamsObject = getObjectOfEntries(hashParams.entries());

  return {
    ...hashParamsObject,
    ...searchParamsObject,
  };
};

function getObjectOfEntries(iterator) {
  const result = {};
  for (const [key, value] of iterator) {
    result[key] = value;
  }

  return result;
}

export const processOpenWithPopup = (url) => {
  const windowFeatures =
    'toolbar=no, titlebar=no, menubar=no, width=500, height=700, top=100, left=100';
  const popup = window.open(url, '_blank', windowFeatures);
  popup?.focus();

  return popup;
};

export const processPopupMessage = (popup) => {
  return new Promise((resolve, reject) => {
    let closeCheckIntervalId;

    if (popup) {
      closeCheckIntervalId = window.setInterval(() => {
        if (popup.closed) {
          window.clearInterval(closeCheckIntervalId);

          reject({ message: 'Error occured while verifying credentials!' });
        }
      }, 1000);
    }

    const messageHandler = async (event) => {
      if (event.data.source !== 'automatisch') {
        return;
      }

      const data = parseUrlSearchParams(event);
      window.removeEventListener('message', messageHandler);

      if (closeCheckIntervalId) {
        window.clearInterval(closeCheckIntervalId);
      }

      resolve(data);
    };

    window.addEventListener('message', messageHandler, false);
  });
};
