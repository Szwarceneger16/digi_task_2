import {
  toggleBasketDisplay,
  clearBasketElements,
  processOrder,
  moveElementBeetwenGrids,
} from "../utils/storeUtils.js";
import { BasketOrderController } from "./BasketOrderController.js";
import {
  moveImageElementBackward,
  moveImageElementForward,
} from "./imageMoveHandler.js";
import { StoreMoveBetweensGridMixin } from "./StoreMoveBetweensGridMixin.js";

const init = (
  displayButton,
  clearButton,
  checkoutButton,
  takeOrderHandler,
  clearBusketHandler,
  toggleDisplayHandler
) => {
  displayButton.addEventListener("click", toggleDisplayHandler, false);
  clearButton.addEventListener("click", clearBusketHandler, false);
  clearButton.setAttribute("disabled", "");
  checkoutButton.setAttribute("disabled", "");
  checkoutButton.addEventListener("click", takeOrderHandler, false);
};

export default class Store extends StoreMoveBetweensGridMixin(
  BasketOrderController
) {
  constructor(
    //elements reference
    basketElementId, //
    basketGridElementId, //
    selectGridElementId, //
    basketDisplayButtonId, //
    basketClearButtonId, //
    basketCheckoutButtonId, //
    // handlers
    takeOrderHandler,
    openModalHandler,
    // store config
    numbersOfImageToOrder,
    // images source
    checkboxCheckSrc,
    checkboxUncheckSrc,
    backwardControlArrowSrc,
    forwardControlArrowSrc
  ) {
    const basketClearButton = document.getElementById(basketClearButtonId);
    const basketCheckoutButton = document.getElementById(
      basketCheckoutButtonId
    );
    const basketImagesGrid = document.getElementById(basketGridElementId);
    const selectImagesGrid = document.getElementById(selectGridElementId);
    const basketDisplayButton = document.getElementById(basketDisplayButtonId);
    const basketContainer = document.getElementById(basketElementId);

    super([numbersOfImageToOrder, basketClearButton, basketCheckoutButton]);

    this.selectImagesGrid = selectImagesGrid;
    this.basketImagesGrid = basketImagesGrid;
    this.openModalHandler = openModalHandler;
    // images source
    this.checkboxCheckSrc = checkboxCheckSrc;
    this.checkboxUncheckSrc = checkboxUncheckSrc;
    this.backwardControlArrowSrc = backwardControlArrowSrc;
    this.forwardControlArrowSrc = forwardControlArrowSrc;

    const clearBusketHandler = () => {
      this.clearBasket();
      clearBasketElements(basketImagesGrid, (imageElement) =>
        moveElementBeetwenGrids(imageElement, selectImagesGrid)
      );
    };
    const processOrderHandler = () =>
      processOrder(basketImagesGrid, takeOrderHandler);
    const toggleDisplayHandler = () =>
      toggleBasketDisplay(basketContainer, basketDisplayButton);

    init(
      basketDisplayButton,
      basketClearButton,
      basketCheckoutButton,
      processOrderHandler,
      clearBusketHandler,
      toggleDisplayHandler
    );
  }

  lazyAppendImagesToGrid = async (imagesArray) => {
    imagesArray.forEach((imageData) => {
      const imageContainer = document.createElement("div");
      imageContainer.insertAdjacentHTML(
        "beforeend",
        `<span class="store-control-container out-basket">
                  <img class="checkbox" src="${this.checkboxUncheckSrc}">
                  <img class="move-left-arrow" src="${this.backwardControlArrowSrc}">
                  <img class="move-right-arrow" src="${this.forwardControlArrowSrc}">
                  </span>
                  <p>${imageData.rover.name}</p>
                  <p>${imageData.earth_date}</p>`
      );
      imageContainer.classList.add("mrp-api-image");
      const checkbox = imageContainer.querySelector(".checkbox");
      const leftArrow = imageContainer.querySelector(".move-left-arrow");
      const rightArrow = imageContainer.querySelector(".move-right-arrow");

      leftArrow.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        moveImageElementBackward(
          event.currentTarget.parentElement.parentElement
        );
      });

      rightArrow.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        moveImageElementForward(
          event.currentTarget.parentElement.parentElement
        );
      });

      let backgroundImage = new Image();
      // append immadietly, lazy display - after full image loading
      backgroundImage.onload = function (e) {
        imageContainer.style.display = "grid";
        imageContainer.style.backgroundImage =
          "url(" + backgroundImage.src + ")";
        backgroundImage = null;
      };
      backgroundImage.src = imageData.img_src;
      imageContainer.onclick = () => {
        this.openModalHandler(imageData.img_src);
      };
      checkbox.addEventListener("click", this.checboxChangeStateHandler, false);

      this.selectImagesGrid.appendChild(imageContainer);
    }, this);
  };
}
