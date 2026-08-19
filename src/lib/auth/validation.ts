export interface LoginFormValues {
  username: string;
  password: string;
}

export interface LoginFormErrors {
  username?: string;
  password?: string;
}

const MOBILE_REGEX = /^[6-9]\d{9}$/;

export function validateLoginForm(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {};
  const username = values.username.trim();

  if (!username) {
    errors.username = "Enter your username or mobile number.";
  } else if (/^\d+$/.test(username) && !MOBILE_REGEX.test(username)) {
    errors.username = "Enter a valid 10-digit mobile number.";
  }

  if (!values.password) {
    errors.password = "Enter your password.";
  } else if (values.password.length < 4) {
    errors.password = "Password must be at least 4 characters.";
  }

  return errors;
}
