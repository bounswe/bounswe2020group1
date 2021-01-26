const calculateTotalSum = require('../ShoppingCart');

const products = [
    {
        product:{
            price: 3.4,
            quantity: 2,
        }
    },
    {
        product:{
            price: 2.5,
            quantity: 3,
        }
    }
]

test('sum of double price of two products with different quantities', () => {
    expect(calculateTotalSum(products)).toBe(14.3);
});