export function validateNewUsername(username) {
  if (username.trim().length === 0) throw new Error('Username cannot be empty');
  if (!/^[a-z0-9_\-]+$/i.test(username)) throw new Error('Username must be alphanumeric');
}

export function validateNewPassword(password) {
  const { length } = password.trim();
  if (length < 8) throw new Error('Password should have 8 characters or more');
}

export function validateUsername(username) {
  if (username.trim().length === 0) throw new Error("What's your username?");
}

export function validatePassword(password) {
  if (password.trim().length === 0) throw new Error('Forgot your password?');
}