// aniamtion for change dispalyed views,
// add out animation for actual displayed element,
// after it end, adding in aniamtion for hidden element
export function toogleViewsAnimation(
  firstElement,
  secondElement,
  animationInName,
  aniamtionInDuration,
  animationOutName = undefined,
  aniamtionOutDuration = undefined,
  aniamtionInDirection = "reverse",
  aniamtionOutDirection = "normal",
  animationInTimingFunction = "ease-out",
  animationOutTimingFunction = "ease-in"
) {
  const animationIn =
    animationInName +
    " " +
    aniamtionInDuration +
    "s " +
    animationInTimingFunction +
    " 0s 1 " +
    aniamtionInDirection +
    " none";
  const animationOut =
    (animationOutName || animationInName) +
    " " +
    (aniamtionOutDuration || aniamtionInDuration) +
    "s " +
    animationOutTimingFunction +
    " 0s 1 " +
    aniamtionOutDirection +
    " none";

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

      outAnimationElement.style.animation = animationOut;
      inAnimationElement.style.animation = animationIn;
    });
  };
}
