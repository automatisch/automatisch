import { expect } from 'vitest';
import { toRequireProperty } from '../assertions/to-require-property';

expect.extend({
  async toRequireProperty(model, requiredProperty) {
    return await toRequireProperty(model, requiredProperty);
  },
});
