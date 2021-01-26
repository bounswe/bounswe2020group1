const calculateTotalSum = require('../ShoppingCart');

const products = [
    {
        product:{
            price: 10,
            quantity: 1,
        }
    },
    {
        product:{
            price: 5,
            quantity: 1,
        }
    }
]

test('sum of price of two products with unit quantities', () => {
    expect(calculateTotalSum(products)).toBe(15);
});