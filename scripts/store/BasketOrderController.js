export class BasketOrderController {
  basketElementsCounter = 0;
  constructor(maxImagesOrder, clearBusketButton, checkoutBusketButton) {
    this.maxImagesOrder = maxImagesOrder;
    this.clearBusketButton = clearBusketButton;
    this.checkoutBusketButton = checkoutBusketButton;
  }

  addToBasket() {
    if (this.basketElementsCounter === this.maxImagesOrder) {
      this.checkoutBusketButton.removeAttribute("disabled");
      return false;
    }

    ++this.basketElementsCounter;
    if (this.basketElementsCounter === this.maxImagesOrder) {
      this.checkoutBusketButton.removeAttribute("disabled");
    } else if (this.basketElementsCounter === 1) {
      this.clearBusketButton.removeAttribute("disabled");
    }

    return true;
  }

  takeFromBasket() {
    --this.basketElementsCounter;
    if (this.basketElementsCounter === 0) {
      this.clearBusketButton.setAttribute("disabled", "");
    } else if (this.basketElementsCounter === this.maxImagesOrder - 1) {
      this.checkoutBusketButton.setAttribute("disabled", "");
    }

    return true;
  }

  clearBasket() {
    this.basketElementsCounter = 0;
    this.clearBusketButton.setAttribute("disabled", "");
    this.checkoutBusketButton.setAttribute("disabled", "");
  }
}
