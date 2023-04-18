const assert = require('chai').assert;
const { subtract } = require('../index.js');

describe('When subtracting numbers', () => {
  it('Should return correct result', () => {
    const result = subtract(3, 2);
    assert.equal(result, 1);
  });
});
