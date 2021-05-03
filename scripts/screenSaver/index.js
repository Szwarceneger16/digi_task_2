import { getRandomArbitrary } from "../utils/screenSaverUtils.js";
import { ScreenSaverGridController } from "./screenSaverGridController.js";

export default class ScreenSaver extends ScreenSaverGridController {
  previousRandomAnimatedElement = null;
  addImageToContainerWithAnimationTimerID = null;
  randomImageAnimateTimerID = null;
  imagesUrlsArray = null;

  constructor(
    screenSaverConatiner,
    initialAnimationName,
    initialAnimationDurationTime,
    initialAnimationOffsetTime,
    initialAnimationTimingFunction,
    animationName,
    animationDurationTime,
    animationOffsetTime,
    animationTimingFunction,
    imageSize
  ) {
    super(screenSaverConatiner, imageSize);
    this.initialAnimationDurationTime = initialAnimationDurationTime;
    this.initialAnimationOffsetTime = initialAnimationOffsetTime;
    this.animationDurationTime = animationDurationTime;
    this.animationOffsetTime = animationOffsetTime;
    this.child = screenSaverConatiner.firstElementChild;
    this.initialAniamtion =
      initialAnimationName +
      " " +
      initialAnimationDurationTime +
      "s " +
      initialAnimationTimingFunction +
      " 0s 1 normal";
    this.animation =
      animationName +
      " " +
      animationDurationTime * 0.5 +
      "s " +
      animationTimingFunction +
      " 0s 2 alternate both";
  }

  randomImageAnimate = () => {
    const randomImageFromGridNumber = getRandomArbitrary(
      0,
      this.screenSaverConatiner.childElementCount
    );
    const randomImageNumber = getRandomArbitrary(
      0,
      this.imagesUrlsArray.length
    );
    this.child.style.animation = "";
    this.child = this.screenSaverConatiner.children[randomImageFromGridNumber];

    this.child.onanimationiteration = () => {
      this.child.src = this.imagesUrlsArray[randomImageNumber];
    };

    this.child.style.animation = this.animation;
  };

  addImageToContainerWithAnimation = () => {
    const randomImageNumber = getRandomArbitrary(
      0,
      this.imagesUrlsArray.length
    );
    this.child.src = this.imagesUrlsArray[randomImageNumber];
    this.child.style.animation = this.initialAniamtion;

    if (!this.child.nextElementSibling) {
      clearInterval(this.addImageToContainerWithAnimationTimerID);
      this.addImageToContainerWithAnimationTimerID = null;

      this.randomImageAnimateTimerID = setInterval(
        this.randomImageAnimate,
        this.animationDurationTime * 1000 + this.animationOffsetTime * 1000
      );
    } else {
      this.child = this.child.nextElementSibling;
    }
  };

  start(urlsArray) {
    this.screenSaverConatiner.style.display = "grid";
    this.imagesUrlsArray = urlsArray;

    this.addImageToContainerWithAnimationTimerID = setInterval(
      this.addImageToContainerWithAnimation,
      this.initialAnimationDurationTime * 1000 +
        this.initialAnimationOffsetTime * 1000
    );
  }
}
