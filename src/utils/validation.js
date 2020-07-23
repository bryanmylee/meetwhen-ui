/**
 * Validation functions take some input and throw errors if certain validation
 * criteria are not met.
 * Otherwise, no error is thrown.
 */

/**
 * Since it is such a common requirement, this function takes a prompt and
 * returns a function which validates non-empty non-whitespace strings, and
 * throws a validation error with the provided prompt.
 * @param {string} prompt The prompt to throw if the field is empty.
 * @returns {(value: string) => void} The validation function returned.
 */
export const getRequired = (prompt) => (value) => {
  if (value.trim().length === 0) throw new Error(prompt);
};

export const validateNewUsername = (username) => {
  if (username.trim().length === 0) throw new Error('Your username cannot be empty');
  if (!/^[a-z0-9_-]+$/i.test(username)) throw new Error('Your username must be alphanumeric');
};

export const validateNewPassword = (password) => {
  if (password.trim().length === 0) throw new Error('Your password cannot be empty');
};

export const validateUsername = (username) => {
  if (username.trim().length === 0) throw new Error('What\'s your username?');
};

export const validatePassword = (password) => {
  if (password.trim().length === 0) throw new Error('Forgot your password?');
};
