const checkPassword = require('../vendor_registration');

test('checks password Abcde123 and accepts it', () => {
  expect(checkPassword("Abcde123")).toBe("ok");
});
