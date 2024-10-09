import validator from 'validator';

/**
 * Validate if the provided email is in a valid format.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email is valid, false otherwise.
 */
export function validateEmail(email: string): boolean {
  return validator.isEmail(email);
}

/**
 * Validate if the provided password meets the strength requirements.
 *
 * @param {string} password - The password to validate.
 * @returns {boolean} - Returns true if the password is strong, false otherwise.
 */
export function validatePasswordStrength(password: string): boolean {
  return validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });
}

/**
 * Validate if the password and confirm password are the same.
 *
 * @param {string} password - The main password.
 * @param {string} confirmPassword - The password to confirm.
 * @returns {boolean} - Returns true if both passwords match, false otherwise.
 */
export function validatePasswordMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}
