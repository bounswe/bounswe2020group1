const checkPassword = require('../vendor_registration');

test('checks password abcde123 and returns error message', () => {
  expect(checkPassword("abcde123")).toBe("This password is too weak. Your password should include one uppercase letter, one lowercase letter and one digit.");
});
