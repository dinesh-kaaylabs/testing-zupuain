export interface FormData {
  user_name: string;
  phone_number: string;
  email_address: string;
  password: string;
  confirm_password: string;
  termsAccepted: boolean;
}

export interface FormErrors {
  user_name?: string;
  phone_number?: string;
  email_address?: string;
  password?: string;
  confirm_password?: string;
  termsAccepted?: string;
}

const VALIDATION_RULES = {
  user_name: {
    required: 'Full name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters' },
    pattern: { value: /^[a-zA-Z\s]+$/, message: 'Name can only contain letters and spaces' }
  },
  phone_number: {
    required: 'Phone number is required',
    pattern: { value: /^[0-9]{10}$/, message: 'Phone number must be exactly 10 digits' }
  },
  email_address: {
    required: 'Email is required',
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' }
  },
  password: {
    required: 'Password is required',
    minLength: { value: 8, message: 'Password must be at least 8 characters' },
    pattern: { 
      value: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, 
      message: 'Password must contain uppercase, lowercase, number, and special character' 
    }
  }
} as const;

const validateField = (value: string, rules: any, fieldName: string): string | undefined => {
  const trimmed = value.trim();
  if (!trimmed && rules.required) return rules.required;
  if (rules.minLength && trimmed.length < rules.minLength.value) return rules.minLength.message;
  if (rules.pattern && !rules.pattern.value.test(fieldName === 'phone_number' ? value.replace(/\s/g, '') : trimmed)) {
    return rules.pattern.message;
  }
  return undefined;
};

export const validateRegistrationForm = (formData: FormData): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};
  Object.entries(VALIDATION_RULES).forEach(([field, rules]) => {
    const error = validateField(formData[field as keyof FormData] as string, rules, field);
    if (error) errors[field as keyof FormErrors] = error;
  });
  if (!formData.confirm_password) {
    errors.confirm_password = 'Please confirm your password';
  } else if (formData.password !== formData.confirm_password) {
    errors.confirm_password = 'Passwords do not match';
  }
  if (!formData.termsAccepted) {
    errors.termsAccepted = 'You must accept the terms and conditions';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateUserName = (user_name: string) => validateField(user_name, VALIDATION_RULES.user_name, 'user_name');
export const validatePhoneNumber = (phone_number: string) => validateField(phone_number, VALIDATION_RULES.phone_number, 'phone_number');
export const validateEmail = (email_address: string) => validateField(email_address, VALIDATION_RULES.email_address, 'email_address');
export const validatePassword = (password: string) => validateField(password, VALIDATION_RULES.password, 'password');
export const validateConfirmPassword = (password: string, confirm_password: string) => 
  !confirm_password ? 'Please confirm your password' : password !== confirm_password ? 'Passwords do not match' : undefined;
export const validateTermsAccepted = (termsAccepted: boolean) => !termsAccepted ? 'You must accept the terms and conditions' : undefined;

export const getPasswordStrength = (password: string): number => {
  const requirements = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  ];
  return requirements.filter(Boolean).length;
};

export const getPasswordStrengthLabel = (strength: number): string => {
  if (strength === 0) return 'Enter password';
  if (strength <= 2) return 'Weak';
  if (strength <= 3) return 'Fair';
  if (strength <= 4) return 'Good';
  return 'Strong';
};
