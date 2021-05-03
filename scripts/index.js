import Store from "./store/index.js";
import ScreenSaver from "./screenSaver/index.js";
import { apiQueryWrapper } from "./api/apiQueryWrapper.js";
import { setModalHandler } from "./modal.js";
import { fetchMarsPhoto } from "./api/fetchMarsPhotos.js";
import { valdiateForm } from "./utils/formUtils.js";
import { toogleViewsAnimation } from "./toogleViewsAnimation.js";

import "./init/initFormValues.js";

const storeView = document.getElementById("store-view");
const createQueryViewElement = document.getElementById("create-query-view");
const modalContainer = document.getElementById("main-mrpimage-modal");
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
  document.getElementById("screen-saver-container-1"),
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

const toggleQueryStoreViews = toogleViewsAnimation(
  createQueryViewElement,
  storeView,
  togglePageAniamtionName,
  togglePageAniamtionDuration
);

document.getElementById("toogle-view-button").addEventListener(
  "click",
  async (e) => {
    e.target.setAttribute("disabled", "");
    toggleQueryStoreViews().then(() => e.target.removeAttribute("disabled"));
  },
  false
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

// add event to button to form submittion
document
  .getElementById("search-mars-photo-form-submit")
  .addEventListener("click", () => {
    const validateResult = valdiateForm(
      document.forms["search-mars-photo-form"],
      processQueryForMRPApi
    );
    if (validateResult) {
      toggleQueryStoreViews();
    }
  });
