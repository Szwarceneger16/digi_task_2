import Store from "./store/index.js";
import ScreenSaver from "./screenSaver/index.js";
import { apiQueryWrapper } from "./api/apiQueryWrapper.js";
import { setModalHandler } from "./modal.js";
import { fetchMarsPhoto } from "./api/fetchMarsPhotos.js";
import { valdiateForm } from "./utils/formUtils.js";

import "./init/initFormValues.js";
import { toggleQueryStoreViews } from "./init/initViewsAnimation.js";

const storeView = document.getElementById(storeViewName);
const modalContainer = document.getElementById(modalContainerName);
const openModal = setModalHandler(storeView, modalContainer);

const store = new Store(
  document.getElementById("basket"),
  document.getElementById("basket-images-grid"),
  document.getElementById("select-images-grid"),
  document.getElementById("open-basket-button"),
  document.getElementById("clear-basket-button"),
  document.getElementById("checkout-basket-button"),
  startScreenSaver,
  openModal,
  numberOfImagesToStartGrid,
  checkboxCheckSrc,
  checkboxUncheckSrc,
  backArrowBasketControlSrc,
  forwardArrowBasketControlSrc
);

const screenSaver = new ScreenSaver(
  document.getElementById(screenSaverContainerName),
  screenSaverInitialAnimationName,
  screenSaverInitialAnimationDurationTime,
  screenSaverInitialAnimationOffsetTime,
  screenSaverInitialAnimationTimingFunction,
  screenSaverAnimationName,
  screenSaverAnimationDurationTime,
  screenSaverAnimationOffsetTime,
  screenSaverAnimationTimingFunction,
  screenSaverImageSize
);

function startScreenSaver(imagesContainersArray) {
  const imagesUrlsArray = imagesContainersArray.map((element) =>
    element.style.backgroundImage.slice(5, -2)
  );
  document.body.style.overflow = "hidden";
  screenSaver.start(imagesUrlsArray);
}

const processQueryForMRPApi = apiQueryWrapper(
  store.lazyAppendImagesToGrid,
  fetchMarsPhoto,
  mrpApiDataLengthForOnePage
);

// add event to button for form submittion
document
  .getElementById(searchMarsPhotoFormSubmitButtonName)
  .addEventListener("click", () => {
    const validateResult = valdiateForm(
      document.forms[searchMarsPhotoFormName],
      processQueryForMRPApi
    );
    if (validateResult) {
      toggleQueryStoreViews();
    }
  });
