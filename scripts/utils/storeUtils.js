export function toggleBasketDisplay(basketElement, toggleBasketButton) {
  basketElement.style.display =
    basketElement.style.display === "block" ? "none" : "block";
  toggleBasketButton.innerHTML =
    basketElement.style.display === "block" ? "Close Basket" : "Open Basket";
}

export function clearBasketElements(basketImagesGrid, moveFunction) {
  Array.from(basketImagesGrid.children).forEach((element) => {
    moveFunction(element);
  });
}

export async function lazyRemoveElementChild(parentOfElementsToRemove) {
  Array.from(parentOfElementsToRemove.children).forEach((el) => {
    parentOfElementsToRemove.removeChild(el);
  });
}

export function processOrder(basketImagesGrid, takeOrderhandler) {
  const selectedImages = Array.from(basketImagesGrid.children);
  lazyRemoveElementChild(basketImagesGrid);
  takeOrderhandler(selectedImages);
}

export function moveElementBeetwenGrids(imageContainer, targetGrid) {
  imageContainer.parentElement.removeChild(imageContainer);
  targetGrid.appendChild(imageContainer);
}
