function getSizeInPercent(size) {
  return 100 / size;
}

export function getGridTemplateStyleAsString(size) {
  return "repeat(" + size + "," + getSizeInPercent(size) + "%)";
}

export function createScreenSaverImage(src) {
  const img = document.createElement("img");
  img.alt = " ";
  img.src = src || "";
  return img;
}

export function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function modifyScreenSaverImagesGrid(
  imagesUrlArray,
  screenSaverContainer,
  appendWithNewImage,
  cellsNumberDifference
) {
  if (cellsNumberDifference > 0) {
    for (let index = 0; index < cellsNumberDifference; index++) {
      let newImage;
      if (appendWithNewImage) {
        const randomImageNumber = getRandomArbitrary(0, imagesUrlArray.length);
        newImage = createScreenSaverImage(imagesUrlArray[randomImageNumber]);
      } else {
        newImage = createScreenSaverImage();
      }

      screenSaverContainer.appendChild(newImage);
    }
  } else if (cellsNumberDifference < 0) {
    for (let index = 0; index < Math.abs(cellsNumberDifference); index++) {
      screenSaverContainer.removeChild(screenSaverContainer.lastChild);
    }
  }
}

export async function createInitialGrid(containerForGrid, imageSize) {
  let gridTemplate = {
    rows: Math.ceil(window.innerHeight / imageSize),
    columns: Math.ceil(window.innerWidth / imageSize),
  };

  containerForGrid.style.gridTemplateRows = getGridTemplateStyleAsString(
    gridTemplate.rows
  );
  containerForGrid.style.gridTemplateColumns = getGridTemplateStyleAsString(
    gridTemplate.columns
  );

  const numberOfImages = gridTemplate.rows * gridTemplate.columns;

  for (let index = 0; index < numberOfImages; index++) {
    const img = createScreenSaverImage();
    containerForGrid.appendChild(img);
  }
}
