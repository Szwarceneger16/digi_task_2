// set event for change in source element,
// then take value from source and setting it to target element
export function setElementAtributeFromOther(
  sourceElement,
  targetElement,
  getSourceValue,
  setTargetValue
) {
  sourceElement.addEventListener("change", (e) => {
    const newValue = getSourceValue(e.currentTarget);
    setTargetValue(targetElement, newValue);
  });
}

export function setInputDateAtrribute(inputElement, atributteName, value) {
  inputElement.setAttribute(atributteName, value);
}

function setErrorMessage(element) {
  if (!element.checkValidity()) {
    element.parentElement.querySelector(".error-message").innerHTML =
      element.validationMessage;
  } else {
    element.parentElement.querySelector(".error-message").innerHTML = "";
  }
}

export function setOptionValues(inputElement, values) {
  values.forEach((el) => {
    inputElement.insertAdjacentHTML(
      "beforeend",
      `<option value='${el.toLowerCase()}'>${el}</option>`
    );
  });
}

// check every field and setting
export function valdiateForm(form, formDataHandler) {
  const formElements = form.elements;

  for (let index = 0; index < form.length; index++) {
    setErrorMessage(formElements[index]);
  }

  if (!form.checkValidity()) {
    return false;
  }

  // pobranie wszytskich obrazow dla podanych danych
  const selectedRovers = Array.from(
    formElements["rover-type"].selectedOptions
  ).map((el) => el.value);
  const selectedCamers = Array.from(
    formElements["camera-type"].selectedOptions
  ).map((el) => el.value);

  formDataHandler(
    formElements["taken-date-from"].valueAsDate,
    formElements["taken-date-to"].valueAsDate,
    selectedRovers,
    selectedCamers
  );
  form.reset();
  return true;
}
