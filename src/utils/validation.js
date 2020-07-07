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
}

export const validateNewUsername = (username) => {
  if (username.trim().length === 0) throw new Error('Username cannot be empty');
  if (!/^[a-z0-9_\-]+$/i.test(username)) throw new Error('Username must be alphanumeric');
}

export const validateNewPassword = (password) => {
  const { length } = password.trim();
  if (length < 8) throw new Error('Password should have 8 characters or more');
}

export const validateUsername = (username) => {
  if (username.trim().length === 0) throw new Error("What's your username?");
}

export const validatePassword = (password) => {
  if (password.trim().length === 0) throw new Error('Forgot your password?');
}