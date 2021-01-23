const checkStock = require('../EditProduct');

test('checks stock -10 and returns error message', () => {
    expect(checkStock(-10)).toBe("Stock can not be less than 0!");
});