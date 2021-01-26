const checkStock = require('../EditProduct');

test('checks stock 0 and returns error message', () => {
    expect(checkStock(0)).toBe("Stock can not be equal to 0!");
});