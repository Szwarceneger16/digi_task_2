export function toggleBasketDisplay(basketElement, toggleBasketButton) {
  basketElement.style.display =
    basketElement.style.display === "block" ? "none" : "block";
  toggleBasketButton.innerHTML =
    basketElement.style.display === "block" ? "Close Basket" : "Open Basket";
}

export async function lazyRemoveElementChild(parentOfElementsToRemove) {
  Array.from(parentOfElementsToRemove.children).forEach((el) => {
    parentOfElementsToRemove.removeChild(el);
  });
}

export function returnOrder(basketImagesGrid) {
  return Array.from(basketImagesGrid.children);
}

export function moveElementBeetwenGrids(imageContainer, targetGrid) {
  imageContainer.parentElement.removeChild(imageContainer);
  targetGrid.appendChild(imageContainer);
}
