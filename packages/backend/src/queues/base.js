/* eslint-disable no-unused-vars */

class BaseQueue {
  constructor(name) {
    if (new.target === BaseQueue) {
      throw new Error('Cannot instantiate abstract class BaseQueue directly.');
    }

    this.name = name;
  }

  // Abstract methods to be implemented by subclasses
  async add(jobName, data, options) {
    throw new Error('Method "add" must be implemented.');
  }

  async remove(jobId) {
    throw new Error('Method "remove" must be implemented.');
  }

  async getRepeatableJobs() {
    throw new Error('Method "getRepeatableJobs" must be implemented.');
  }

  async removeRepeatableJobByKey(jobKey) {
    throw new Error('Method "removeRepeatableJobByKey" must be implemented.');
  }
}

export default BaseQueue;
