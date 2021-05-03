function swapElements(sourceElement, targetElement) {
  if (
    !(sourceElement instanceof HTMLElement) ||
    !(targetElement instanceof HTMLElement)
  )
    throw "invalid arguemnts data";

  const sourceElementSibling =
    sourceElement.nextElementSibling === targetElement
      ? sourceElement
      : sourceElement.nextElementSibling;
  const sourceElementParent = sourceElement.parentElement;
  sourceElementParent.insertBefore(sourceElement, targetElement);
  sourceElementParent.insertBefore(targetElement, sourceElementSibling);
}

function moveImageByPositionNumber(sourceImageContainer, relativePosition) {
  if (
    !(sourceImageContainer instanceof HTMLElement) ||
    typeof relativePosition !== "number" ||
    relativePosition === 0
  )
    throw "invalid arguemnts data";
  let targetImageContainer = sourceImageContainer;
  const parentElement = sourceImageContainer.parentElement;

  if (relativePosition > 0) {
    while (relativePosition !== 0) {
      if (sourceImageContainer == parentElement.lastElementChild) return false;
      targetImageContainer = targetImageContainer.nextElementSibling;
      --relativePosition;
    }
  } else {
    while (relativePosition !== 0) {
      if (sourceImageContainer == parentElement.firstElementChild) return false;
      targetImageContainer = targetImageContainer.previousElementSibling;
      ++relativePosition;
    }
  }

  swapElements(sourceImageContainer, targetImageContainer);
}

export function moveImageElementForward(imageContainer) {
  moveImageByPositionNumber(imageContainer, 1);
}

export function moveImageElementBackward(imageContainer) {
  moveImageByPositionNumber(imageContainer, -1);
}
