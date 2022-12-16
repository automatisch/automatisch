const delayUntilAsMilliseconds = (delayUntil: string) => {
  const delayUntilDate = new Date(delayUntil);
  const now = new Date();

  return delayUntilDate.getTime() - now.getTime();
};

export default delayUntilAsMilliseconds;
