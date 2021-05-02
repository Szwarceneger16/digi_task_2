import {
  setOptionValues,
  setInputDateAtrribute,
  setElementAtributeFromOther,
} from "../utils/formUtils.js";

const formElement = document.forms[searchMarsPhotoFormName].elements;
const todayDateAsString = new Date().toISOString().split("T")[0];

setOptionValues(formElement["rover-type"], roverTypes);
setOptionValues(formElement["camera-type"], roverCameraTypes);
setInputDateAtrribute(formElement["taken-date-to"], "max", todayDateAsString);
setInputDateAtrribute(formElement["taken-date-from"], "max", todayDateAsString);

// set minimal possible date to select for upper range
// equal for selected date in minimal range
const getLowerRangeDateAsString = (element) => {
  element.valueAsDate.toISOString().split("T")[0];
};
const setMaxUpperRangeDate = (element, value) => {
  setInputDateAtrribute(element, "max", value);
};
setElementAtributeFromOther(
  formElement["taken-date-from"],
  formElement["taken-date-to"],
  getLowerRangeDateAsString,
  setMaxUpperRangeDate
);

// default values, for testing
formElement["taken-date-from"].valueAsDate = new Date(2021, 3, 26);
formElement["taken-date-to"].valueAsDate = new Date();
formElement["camera-type"].selectedIndex = 0;
formElement["rover-type"].selectedIndex = 0;
