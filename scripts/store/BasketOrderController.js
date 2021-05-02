export class BasketOrderController {
  basketElementsCounter = 0;
  constructor(maxImagesOrder, clearBusketButton, checkoutBusketButton) {
    this.maxImagesOrder = maxImagesOrder;
    this.clearBusketButton = clearBusketButton;
    this.checkoutBusketButton = checkoutBusketButton;
  }
  observer(msg) {
    console.log(msg, this.basketElementsCounter);
  }

  addToBasket() {
    this.observer("add przed");

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

    this.observer("add po");
    return true;
  }

  takeFromBasket() {
    this.observer("sub przed");
    --this.basketElementsCounter;
    if (this.basketElementsCounter === 0) {
      this.clearBusketButton.setAttribute("disabled", "");
    } else if (this.basketElementsCounter === this.maxImagesOrder - 1) {
      this.checkoutBusketButton.setAttribute("disabled", "");
    }

    this.observer("sub po");
    return true;
  }

  clearBasket() {
    this.basketElementsCounter = 0;
    this.clearBusketButton.setAttribute("disabled", "");
    this.checkoutBusketButton.setAttribute("disabled", "");
  }
}
