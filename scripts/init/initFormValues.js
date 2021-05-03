import {
  setOptionValues,
  setInputDateAtrribute,
  setElementAtributeFromOther,
} from "../utils/formUtils.js";

const formElement = document.forms["search-mars-photo-form"].elements;
const todayDateAsString = new Date().toISOString().split("T")[0];

setOptionValues(formElement["rover-type"], roverTypes);
setOptionValues(formElement["camera-type"], roverCameraTypes);
setInputDateAtrribute(formElement["taken-date-to"], "max", todayDateAsString);
setInputDateAtrribute(formElement["taken-date-from"], "max", todayDateAsString);

// set minimal possible date to select for upper range
// equal for selected date in minimal range
const getLowerRangeDateAsString = (element) =>
  element.valueAsDate.toISOString().split("T")[0];
const setMinUpperRangeDate = (element, value) =>
  setInputDateAtrribute(element, "min", value);
setElementAtributeFromOther(
  formElement["taken-date-from"],
  formElement["taken-date-to"],
  getLowerRangeDateAsString,
  setMinUpperRangeDate
);

// default values, for testing
// formElement["taken-date-from"].valueAsDate = new Date(2021, 3, 26);
// formElement["taken-date-to"].valueAsDate = new Date();
// formElement["camera-type"].selectedIndex = 0;
// formElement["rover-type"].selectedIndex = 0;
