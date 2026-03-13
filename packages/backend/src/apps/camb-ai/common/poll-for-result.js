const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const pollForResult = async ($, endpoint, { interval = 3000, maxAttempts = 40 } = {}) => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const { data } = await $.http.get(`/apis${endpoint}`);

      const status = (data.status || '').toString().toUpperCase();

      if (status === 'SUCCESS') {
        return data;
      }

      if (status === 'ERROR' || status === 'FAILED') {
        throw new Error(`Task failed: ${data.message || data.error || 'Unknown error'}`);
      }

      if (status === 'TIMEOUT') {
        throw new Error('Task timed out on the server. Try again or use smaller input.');
      }

      if (status === 'PAYMENT_REQUIRED') {
        throw new Error('Insufficient credits. Please check your CAMB AI account balance.');
      }

      await sleep(interval);
    } catch (error) {
      if (error.response?.status === 404) {
        await sleep(interval);
        continue;
      }
      throw error;
    }
  }

  throw new Error(`Polling timed out after ${maxAttempts} attempts.`);
};

export default pollForResult;
