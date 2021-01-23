const checkPassword = require('../customer_registration');

test('checks password Abcde123 and accepts it', () => {
  expect(checkPassword("Abcde123")).toBe("ok");
});
