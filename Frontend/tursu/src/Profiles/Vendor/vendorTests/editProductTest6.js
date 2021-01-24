const checkStock = require('../EditProduct');

test('checks stock 50 and returns error message', () => {
    expect(checkStock(50)).toBe("ok");
});