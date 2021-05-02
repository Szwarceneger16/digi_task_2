const ScreenSaver = ScreenSaverCreator();
export { ScreenSaver };

function ScreenSaverCreator() {
  const screenSaverConatiner = document.getElementById(
    "screen-saver-container-1"
  );
  // tablica url do wybranych obrazow
  let imagesUrlArray;

  // aktualne wymairy siatki z obrazami w wygaszaczu
  let actualGridSize = {
    rows: Math.ceil(window.innerHeight / screenSaverImageSize),
    columns: Math.ceil(window.innerWidth / screenSaverImageSize),
    numberOfImages: 0,
  };
  actualGridSize.numberOfImages = actualGridSize.rows * actualGridSize.columns;

  const screenSaverConatinerChildreen = screenSaverConatiner.children;
  let counter = 0;
  let addImageToConatinerTimerID = undefined,
    randomImageAnimateTimerID;

  const windowSizeChangeHandler = (e) => {
    const [innerWidth, innerHeight] = [window.innerWidth, window.innerHeight];
    const [rows, columns] = [
      Math.ceil(innerHeight / screenSaverImageSize),
      Math.ceil(innerWidth / screenSaverImageSize),
    ];
    const numberOfImages = rows * columns;

    //console.log(actualGridSize.rows , 'calcualted rows:'+rows , actualGridSize.columns ,'calcualted cols:'+ columns);

    if (rows !== actualGridSize.rows) {
      actualGridSize.rows = rows;
      screenSaverConatiner.style.gridTemplateRows = `repeat(${rows},${
        100 / rows
      }%)`;
    }
    if (columns !== actualGridSize.columns) {
      actualGridSize.columns = columns;
      screenSaverConatiner.style.gridTemplateColumns = `repeat(${columns},${
        100 / columns
      }%)`;
    }
    const subtractionNumberOfImages =
      numberOfImages - actualGridSize.numberOfImages;

    if (subtractionNumberOfImages > 0) {
      actualGridSize.numberOfImages = numberOfImages;
      for (let index = 0; index < subtractionNumberOfImages; index++) {
        const img = document.createElement("img");
        img.alt = " ";
        img.src = "";
        if (typeof addImageToConatinerTimerID === "string") {
          const randomImageNumber = Math.floor(
            Math.random() * (numberOfImagesToStartGrid - 1)
          );
          img.src = imagesUrlArray[randomImageNumber];
        }

        screenSaverConatiner.appendChild(img);
      }
    } else if (subtractionNumberOfImages < 0) {
      actualGridSize.numberOfImages = numberOfImages;
      for (
        let index = 0;
        index < Math.abs(subtractionNumberOfImages);
        index++
      ) {
        screenSaverConatiner.removeChild(screenSaverConatiner.lastChild);
      }
    }
  };

  let previousRandomAnimatedElement = null;
  const randomImageAnimate = () => {
    if (previousRandomAnimatedElement)
      previousRandomAnimatedElement.style.animation = "";
    const randomImage = Math.floor(
      screenSaverConatinerChildreen.length * Math.random()
    );
    const el = screenSaverConatinerChildreen[randomImage];
    previousRandomAnimatedElement = el;
    const randomImageNumber = Math.floor(
      Math.random() * (numberOfImagesToStartGrid - 1)
    );

    el.style.animation = `screen-saver ${
      screenSaverAnimationDurationTime * 0.5
    }s linear 0s 2 alternate both`;
    el.style.onanimatioend = () => {
      el.src = imagesUrlArray[randomImageNumber];
      el.style.animationIterationCount = 2;
      el.style.onanimatioend = null;
    };
  };

  // poczatkowa aniamcja ladujaca obrazy
  const addImageToConatinerAniamtion = () => {
    const el = screenSaverConatinerChildreen[counter];
    const randomImageNumber = Math.floor(
      Math.random() * (numberOfImagesToStartGrid - 1)
    );
    el.src = imagesUrlArray[randomImageNumber];
    el.style.animation = `screen-saver-initial ${screenSaverInitialAnimationDurationTime}s linear 0s 1 normal `;

    counter++;
    if (counter >= screenSaverConatinerChildreen.length) {
      clearInterval(addImageToConatinerTimerID);
      addImageToConatinerTimerID = "";

      randomImageAnimateTimerID = setInterval(
        randomImageAnimate,
        screenSaverAnimationDurationTime * 1000 +
          screenSaverAnimationOffsetTime * 1000
      );
    }
  };

  // obserwacja zmianu rozmairu okna
  window.onresize = windowSizeChangeHandler;

  return function (imagesArray) {
    screenSaverConatiner.style.display = "grid";
    document.body.style.overflow = "hidden";
    imagesUrlArray = imagesArray.map((el) => el.img_src);
    addImageToConatinerTimerID = setInterval(
      addImageToConatinerAniamtion,
      screenSaverInitialAnimationDurationTime * 1000 +
        screenSaverInitialAnimationOffsetTime * 1000
    );
  };
}

// utworzenie wstepne siatki obrazow dla wygaszacza ekranu
(async () => {
  const screenSaverConatiner = document.getElementById(
    "screen-saver-container-1"
  );
  let actualGridSize = {
    rows: Math.ceil(window.innerHeight / screenSaverImageSize),
    columns: Math.ceil(window.innerWidth / screenSaverImageSize),
    numberOfImages: 0,
  };
  actualGridSize.numberOfImages = actualGridSize.rows * actualGridSize.columns;
  screenSaverConatiner.style.gridTemplateRows = `repeat(${
    actualGridSize.rows
  },${100 / actualGridSize.rows}%)`;
  screenSaverConatiner.style.gridTemplateColumns = `repeat(${
    actualGridSize.columns
  },${100 / actualGridSize.columns}%)`;
  const [screenWidth, screenHeight] = [window.innerWidth, window.innerHeight];

  const numberOfImages =
    Math.ceil(screenWidth / screenSaverImageSize) *
    Math.ceil(screenHeight / screenSaverImageSize);

  //console.log(numberOfImages);
  for (let index = 0; index < numberOfImages; index++) {
    const img = document.createElement("img");
    img.alt = " ";
    img.src = "";
    //img.src = "http://mars.jpl.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01004/opgs/edr/fcam/FLB_486615455EDR_F0481570FHAZ00323M_.JPG"
    screenSaverConatiner.appendChild(img);
  }
})();
