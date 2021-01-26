const checkPrice = require('../EditProduct');

test('checks price 0 and returns error message', () => {
    expect(checkPrice(0)).toBe("Price can not be equal to 0!");
});