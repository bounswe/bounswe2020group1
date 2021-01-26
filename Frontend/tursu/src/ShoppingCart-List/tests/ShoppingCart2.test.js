const calculateTotalSum = require('../ShoppingCart');

const products = [
    {
        product:{
            price: 10,
            quantity: 2,
        }
    },
    {
        product:{
            price: 5,
            quantity: 1,
        }
    }
]

test('sum of price of two products with different quantities', () => {
    expect(calculateTotalSum(products)).toBe(25);
});