import Store from "./store/index.js";
import { lazyRemoveElementChild } from "./utils/storeUtils.js";
import { apiQueryWrapper } from "./api/apiQueryWrapper.js";
import { setModalHandler } from "./modal.js";
import { ScreenSaver } from "./screenSaver.js";
import { fetchMarsPhoto } from "./api/fetchMarsPhotos.js";
import { valdiateForm } from "./utils/formUtils.js";

import { initFormValues } from "./init/initFormValues.js";
import { toggleQueryStoreViews } from "./init/initViewsAnimation.js";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", executeAfterFullDOMLoading);
} else {
  executeAfterFullDOMLoading();
}

const selectImagesGrid = document.getElementById("select-images-grid");
const storeView = document.getElementById("store-view");
const modalContainer = document.getElementById("main-mrpimage-modal");
const openModal = setModalHandler(storeView, modalContainer);

const store = new Store(
  "basket",
  "basket-images-grid",
  "select-images-grid",
  "open-basket-button",
  "clear-basket-button",
  "checkout-basket-button",
  startScreenSaver,
  openModal,
  numberOfImagesToStartGrid,
  checkboxCheckSrc,
  checkboxUncheckSrc,
  backArrowBasketControlSrc,
  forwardArrowBasketControlSrc
);

function startScreenSaver(imagesArray) {
  lazyRemoveElementChild(selectImagesGrid);
  ScreenSaver(imagesArray);
}

const processQueryForMRPApi = apiQueryWrapper(
  store.lazyAppendImagesToGrid,
  fetchMarsPhoto,
  mrpApiDataLengthForOnePage
);

function executeAfterFullDOMLoading() {
  initFormValues();
  // add event to button for form submittion
  document
    .getElementById("search-mars-rovers-captured-photos-form-submit-button")
    .addEventListener("click", () => {
      const validateResult = valdiateForm(
        document.forms[searchMarsRoversCapturedPhotos],
        processQueryForMRPApi
      );
      if (validateResult) {
        toggleQueryStoreViews();
      }
    });
}
