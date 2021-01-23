const checkPassword = require('../customer_registration');

test('checks password Ab123 and returns error message', () => {
  expect(checkPassword("Ab123")).toBe("Your password is too short, it should at least be 8 characters long!");
});
