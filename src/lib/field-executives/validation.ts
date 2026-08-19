const MOBILE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface FieldExecutiveFormValues {
  fullName: string;
  mobile: string;
  email: string;
  assignedArea: string;
  passwordMode: "GENERATE" | "TEMPORARY";
  temporaryPassword: string;
}

export interface FieldExecutiveFormErrors {
  fullName?: string;
  mobile?: string;
  email?: string;
  assignedArea?: string;
  temporaryPassword?: string;
}

export function validateFieldExecutiveForm(
  values: FieldExecutiveFormValues,
): FieldExecutiveFormErrors {
  const errors: FieldExecutiveFormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Enter the field executive's full name.";
  }

  if (!values.mobile.trim()) {
    errors.mobile = "Enter a mobile number.";
  } else if (!MOBILE_REGEX.test(values.mobile.trim())) {
    errors.mobile = "Enter a valid 10-digit mobile number.";
  }

  if (values.email.trim() && !EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.assignedArea.trim()) {
    errors.assignedArea = "Select or enter an assigned area.";
  }

  if (values.passwordMode === "TEMPORARY") {
    if (!values.temporaryPassword) {
      errors.temporaryPassword = "Enter a temporary password.";
    } else if (values.temporaryPassword.length < 8) {
      errors.temporaryPassword = "Password must be at least 8 characters.";
    }
  }

  return errors;
}
