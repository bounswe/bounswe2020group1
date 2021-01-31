const calculateTotalSum = require('../ShoppingCart');

const products = [
    {
        product:{
            price: 0,
            quantity: 1,
        }
    },
    {
        product:{
            price: 5,
            quantity: 0,
        }
    }
]

test('sum of two products with different zero combinations', () => {
    expect(calculateTotalSum(products)).toBe(0);
});