interface Action {
    inputId: string;
    validationResult: any; // Replace 'any' with the appropriate type for validationResult
    inputValue: any; // Replace 'any' with the appropriate type for inputValue
    // Add other properties if present in the action
  }
  
  interface State {
    inputValues: { [key: string]: any }; // Replace 'any' with the appropriate type for inputValues
    inputValidities: { [key: string]: any }; // Replace 'any' with the appropriate type for inputValidities
    formIsValid: boolean;
    // Add other properties if present in the state
  }
  
  export const reducer = (state: State, action: Action): State => {
    const { inputId, validationResult, inputValue } = action;
  
    const updatedValues = {
      ...state.inputValues,
      [inputId]: inputValue,
    };
  
    const updatedValidities = {
      ...state.inputValidities,
      [inputId]: validationResult,
    };
  
    let updatedFormIsValid = true;
  
    for (const key in updatedValidities) {
      if (updatedValidities[key] !== undefined) {
        updatedFormIsValid = false;
        break;
      }
    }
  
    return {
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      formIsValid: updatedFormIsValid,
      // Ensure all properties from the state are returned
      // If there are more properties in the state, add them here
      // Example: ...state, inputValues: updatedValues, inputValidities: updatedValidities, formIsValid: updatedFormIsValid
    };
  };
  