const checkPassword = require('../customer_registration');

test('checks password Abcdefgh and returns error message', () => {
  expect(checkPassword("Abcdefgh")).toBe("This password is too weak. Your password should include one uppercase letter, one lowercase letter and one digit.");
});
