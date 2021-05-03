import { moveElementBeetwenGrids } from "../utils/storeUtils.js";

function toggleCheckState(checkBoxElement, imageCheckSrc, imageUnchekSrc) {
  if (checkBoxElement.classList.contains("check")) {
    checkBoxElement.src = imageUnchekSrc;
    checkBoxElement.classList.remove("check");
  } else {
    checkBoxElement.src = imageCheckSrc;
    checkBoxElement.classList.add("check");
  }
}

function toggleBasketControlsState(controlContainer) {
  if (controlContainer.classList.contains("in-basket")) {
    controlContainer.classList.remove("in-basket");
    controlContainer.classList.add("out-basket");
  } else {
    controlContainer.classList.remove("out-basket");
    controlContainer.classList.add("in-basket");
  }
}

export const StoreMoveBetweensGridMixin = (CartController) =>
  class extends CartController {
    constructor(CartControllerConstructorArgs) {
      super(...CartControllerConstructorArgs);
    }

    checboxChangeStateHandler = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const checkBox = event.currentTarget;
      const isChecked = checkBox.classList.contains("check");
      const imageContainer = checkBox.parentElement.parentElement;
      if (!isChecked) {
        if (!this.addToBasket()) return;
        this.moveElementTo(imageContainer, this.basketImagesGrid);
      } else {
        if (!this.takeFromBasket()) return;
        this.moveElementTo(imageContainer, this.selectImagesGrid);
      }
    };

    moveElementTo = (imageContainer, targetContainer) => {
      const controlContainer = imageContainer.querySelector(
        ".store-control-container"
      );
      const checkBox = controlContainer.querySelector(".checkbox");

      moveElementBeetwenGrids(imageContainer, targetContainer);

      // checks that image container had appended position controls in basket
      if (controlContainer.classList.length !== 1) {
        toggleBasketControlsState(controlContainer);
      } else {
        // create new position controls if didn't have
        appendBasketControls(
          controlContainer,
          this.backwardControlArrowSrc,
          this.forwardControlArrowSrc,
          this.moveImageElementBackward,
          this.moveImageElementForward
        );
      }
      toggleCheckState(
        checkBox,
        this.checkboxCheckSrc,
        this.checkboxUncheckSrc
      );
    };
  };
