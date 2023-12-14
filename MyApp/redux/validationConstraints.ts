import {validate} from 'validate.js';

type ValidationConstraints = Record<string, any>;

export const validateString = (
  id: string,
  value: string,
): string | undefined => {
  const constraints: ValidationConstraints = {
    presence: {allowEmpty: false, message: "can't be empty!"},
  };

  if (value !== '') {
    constraints.format = {
      pattern: '[a-z]*',
      flags: 'i',
      message: 'value can only contain letters',
    };
  }
  const validationResult = validate({[id]: value}, {[id]: constraints});

  return validationResult && validationResult[id];
};

export const validateUsername = (
  id: string,
  value: string,
): string | undefined => {
  const constraints = {
    presence: {allowEmpty: false, message: "can't be empty!"},
    format: {
      pattern: /^[A-Za-z0-9_-]+$/, // This pattern allows letters, numbers, underscores, and dashes
      message: 'can only contain letters, numbers, underscores, and dashes',
    },
  };

  const validationResult = validate({[id]: value}, {[id]: constraints});

  return validationResult && validationResult[id];
};

export const validateMobile = (
  id: string,
  value: string,
): string | undefined => {
  const constraints = {
    presence: {allowEmpty: false, message: "can't be empty!"},
    length: {
      is: 10,
      message: 'must have exactly 10 digits',
    },
    format: {
      pattern: '^[0-9]*$',
      flags: 'i',
      message: 'can only contain digits',
    },
  };

  const validationResult = validate({[id]: value}, {[id]: constraints});

  return validationResult && validationResult[id];
};

export const validateAadhar = (
  id: string,
  value: string,
): string | undefined => {
  const constraints = {
    presence: {allowEmpty: false, message: "can't be empty!"},
    length: {
      is: 12,
      message: 'must have exactly 12 digits',
    },
    format: {
      pattern: '^[2-9][0-9]*$',
      flags: 'i',
      message: 'should not start with 0 or 1 and can only contain digits',
    },
  };

  const validationResult = validate({[id]: value}, {[id]: constraints});

  return validationResult && validationResult[id];
};

export const validateEmail = (
  id: string,
  value: string,
): string | undefined => {
  const constraints: ValidationConstraints = {
    presence: {allowEmpty: false, message: "Email can't be empty!"},
  };

  if (value !== '') {
    constraints.email = {
      message: 'Please provide a valid email address!',
    };
  }

  const validationResult = validate({[id]: value}, {[id]: constraints});

  return validationResult && validationResult[id];
};

export const validatePassword = (
  id: string,
  value: string,
): string | undefined => {
  const constraints: ValidationConstraints = {
    presence: {allowEmpty: false, message: "can't be empty!"},
  };

  if (value !== '') {
    constraints.length = {
      minimum: 6,
      message: 'Must be atleast 6 characters',
    };
  }
  const validationResult = validate({[id]: value}, {[id]: constraints});

  return validationResult && validationResult[id];
};

export const validateLength = (
  id: string,
  value: string,
  minLength: number | null,
  maxLength: number | null,
  allowEmpty: boolean,
): string | undefined => {
    
  const constraints: ValidationConstraints = {
    presence: {allowEmpty},
  };

  if (!allowEmpty || value !== '') {
    constraints.length = {};
    if (minLength !== null) {
      constraints.length.minimum = minLength;
    }
    if (maxLength !== null) {
      constraints.length.maximum = maxLength;
    }
  }
  const validationResult = validate({[id]: value}, {[id]: constraints});

  return validationResult && validationResult[id];
};
