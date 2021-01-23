const checkPrice = require('../EditProduct');

test('checks price 50 and returns error message', () => {
    expect(checkPrice(50)).toBe("ok");
});