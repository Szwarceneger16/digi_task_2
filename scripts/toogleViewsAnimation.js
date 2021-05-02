// aniamtion for change dispalyed views,
// add out animation for actual displayed element,
// after it end, adding in aniamtion for hidden element
export function toogleViewsAnimation(
  firstElement,
  secondElement,
  toggleAnimationName
) {
  firstElement.style.animationDuration = togglePageAniamtionDuration + "s";
  secondElement.style.animationDuration = togglePageAniamtionDuration + "s";
  firstElement.style.animationFillMode = "none";
  secondElement.style.animationFillMode = "none";
  firstElement.style.animationIterationCount = 1;
  secondElement.style.animationIterationCount = 1;

  return async () => {
    return new Promise(function (resolve, reject) {
      let outAnimationElement, inAnimationElement;
      if (window.getComputedStyle(firstElement, null).display === "block") {
        outAnimationElement = firstElement;
        inAnimationElement = secondElement;
      } else {
        inAnimationElement = firstElement;
        outAnimationElement = secondElement;
      }

      outAnimationElement.style.animationDirection = "normal";
      inAnimationElement.style.animationDirection = "reverse";

      outAnimationElement.onanimationend = () => {
        outAnimationElement.style.display = "none";
        outAnimationElement.onanimationend = null;
        inAnimationElement.style.display = "block";
      };
      inAnimationElement.onanimationend = () => {
        inAnimationElement.onanimationend = null;
        firstElement.style.animationName = "";
        secondElement.style.animationName = "";
        resolve();
      };

      firstElement.style.animationName = toggleAnimationName;
      secondElement.style.animationName = toggleAnimationName;
    });
  };
}
