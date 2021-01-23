const checkPrice = require('../EditProduct');

test('checks price -10 and returns error message', () => {
    expect(checkPrice(-10)).toBe("Price can not be less than 0!");
});