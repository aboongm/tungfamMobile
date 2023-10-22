import {
    validateAadhar,
    validateEmail,
    validateLength,
    validateMobile,
    validatePassword,
    validateString,
    validateUsername
  } from "../validationConstraints";
  
  export const validateInput = (inputId, inputValue) => {
    if (inputId === "username") {
      return validateUsername(inputId, inputValue);
    } else if (inputId === "aadhar") {
      return validateAadhar(inputId, inputValue);
    } else if (inputId === "mobile") {
      return validateMobile(inputId, inputValue);
    } else if (inputId === "email") {
      return validateEmail(inputId, inputValue);
    } else if (inputId === "password") {
      return validatePassword(inputId, inputValue);
    } else if (inputId === "about") {
      console.log("Yes");
      return validateLength(inputId, inputValue, 0, 150, true);
    }
  };
  