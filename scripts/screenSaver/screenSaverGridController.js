import {
  modifyScreenSaverImagesGrid,
  getGridTemplateStyleAsString,
  createInitialGrid,
} from "../utils/screenSaverUtils.js";

export class ScreenSaverGridController {
  actualGridSize = {
    rows: 0,
    columns: 0,
    cells: 0,
  };
  constructor(screenSaverConatiner, imageSize) {
    this.screenSaverConatiner = screenSaverConatiner;
    createInitialGrid(this.screenSaverConatiner, imageSize);
    this.imageSize = imageSize;
    this.actualGridSize.rows = Math.ceil(window.innerHeight / this.imageSize);
    this.actualGridSize.columns = Math.ceil(window.innerWidth / this.imageSize);
    this.actualGridSize.cells =
      this.actualGridSize.rows * this.actualGridSize.columns;

    window.onresize = this.windowSizeChangeHandler;
  }

  windowSizeChangeHandler() {
    const [rows, columns] = [
      Math.ceil(window.innerHeight / this.imageSize),
      Math.ceil(window.innerWidth / this.imageSize),
    ];

    if (rows !== actualGridSize.rows) {
      this.actualGridSize.rows = rows;
      this.screenSaverConatiner.style.gridTemplateRows = getGridTemplateStyleAsString(
        rows
      );
    }
    if (columns !== actualGridSize.columns) {
      this.actualGridSize.columns = columns;
      this.screenSaverConatiner.style.gridTemplateColumns = getGridTemplateStyleAsString(
        columns
      );
    }

    const cells = rows * columns;
    const cellsNumberDifference = cells - actualGridSize.cells;
    this.actualGridSize.cells = cells;

    modifyScreenSaverImagesGrid(
      this.images,
      this.screenSaverConatiner,
      cellsNumberDifference
    );
  }
}
