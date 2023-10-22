import { validate } from "validate.js";

export const validateString = (id, value) => {
  const constraints = {
    presence: { allowEmpty: false, message: "can't be empty!" },
  };

  if (value !== "") {
    constraints.format = {
      pattern: "[a-z]*",
      flags: "i",
      message: "value can only contain letters",
    };
  }
  const validationResult = validate({ [id]: value }, { [id]: constraints });

  return validationResult && validationResult[id];
};

export const validateUsername = (id, value) => {
  const constraints = {
    presence: { allowEmpty: false, message: "can't be empty!" },
    format: {
      pattern: /^[A-Za-z0-9_-]+$/, // This pattern allows letters, numbers, underscores, and dashes
      message: "can only contain letters, numbers, underscores, and dashes",
    },
  };

  const validationResult = validate({ [id]: value }, { [id]: constraints });

  return validationResult && validationResult[id];
};


export const validateMobile = (id, value) => {
  const constraints = {
    presence: { allowEmpty: false, message: "can't be empty!" },
    length: {
      is: 10,
      message: "must have exactly 10 digits",
    },
    format: {
      pattern: "^[0-9]*$",
      flags: "i",
      message: "can only contain digits",
    },
  };

  const validationResult = validate({ [id]: value }, { [id]: constraints });

  return validationResult && validationResult[id];
};

export const validateAadhar = (id, value) => {
  const constraints = {
    presence: { allowEmpty: false, message: "can't be empty!" },
    length: {
      is: 12,
      message: "must have exactly 12 digits",
    },
    format: {
      pattern: "^[2-9][0-9]*$",
      flags: "i",
      message: "should not start with 0 or 1 and can only contain digits",
    },
  };

  const validationResult = validate({ [id]: value }, { [id]: constraints });

  return validationResult && validationResult[id];
};


export const validateEmail = (id, value) => {
  const constraints = {
    presence: { allowEmpty: false },
  };

  if (value !== "") {
    constraints.email = true;
  }
  const validationResult = validate({ [id]: value }, { [id]: constraints });

  return validationResult && validationResult[id];
};

export const validatePassword = (id, value) => {
  const constraints = {
    presence: { allowEmpty: false, message: "can't be empty!" },
  };

  if (value !== "") {
    constraints.length = {
      minimum: 6,
      message: "Must be atleast 6 characters",
    };
  }
  const validationResult = validate({ [id]: value }, { [id]: constraints });

  return validationResult && validationResult[id];
};

export const validateLength = (id, value, minLength, maxLength, allowEmpty) => {
  const constraints = {
    presence: { allowEmpty },
  };

  if (!allowEmpty || value !== "") {
    constraints.length = {}
    if (minLength !== null) {
      constraints.length.minimum = minLength
    }
    if (maxLength !== null) {
      constraints.length.maximum = maxLength
    }
  }
  const validationResult = validate({ [id]: value }, { [id]: constraints });

  return validationResult && validationResult[id];
};
