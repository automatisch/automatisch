export const mockConfigState = {
  isCloud: false,
};

export const resetMockConfig = () => {
  for (const key in mockConfigState) {
    delete (mockConfigState as any)[key];
  }
};

export const setMockConfig = (config: Partial<typeof mockConfigState>) => {
  Object.assign(mockConfigState, config);
};
