const PATTERNS = Object.freeze({
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+[0-9\s]{10,20}$/
});

const MESSAGES = Object.freeze({
  REQUIRED: 'validation.required',
  INVALID_EMAIL: 'validation.invalidEmail',
  INVALID_PHONE: 'validation.invalidPhone'
});


export function isValidEmail(email) {
  if (!email) return true; 
  return PATTERNS.EMAIL.test(email);
}


export function isValidPhone(phone) {
  if (!phone) return true;
  return PATTERNS.PHONE.test(phone);
}

export function validateRequired(data, fields) {
  const errors = {};
  fields.forEach(field => {
    if (!data[field]) {
      errors[field] = MESSAGES.REQUIRED;
    }
  });
  return errors;
}

export function getEmailValidationKey() {
  return MESSAGES.INVALID_EMAIL;
}

export function getPhoneValidationKey() {
  return MESSAGES.INVALID_PHONE;
} 