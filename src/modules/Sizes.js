import { canvas } from "./Canvas";

const params = {
  width: 600,
  height: 200,
  padding: 20,
  rowCount: 5,
};
class Sizes {
  constructor(params) {
    // this.width = canvas.canvas.parentElement.getBoundingClientRect().width * 0.95;
    this.width = params.width;
    this.height = params.height;
    this.dpi = 2;
    this.padding = params.padding * this.dpi;
    this.totalWidth = this.width * this.dpi;
    this.totalHeight = this.height * this.dpi;
    this.viewHeight = this.totalHeight - this.padding * 2;
    this.viewWidth = this.totalWidth;
    this.rowCount = params.rowCount;
    this.step = this.viewHeight / this.rowCount;
    this.yLines = [];
    this.yLinesCoords = [];
    this.xLine;
    this.yMin;
    this.yMax;
    this.yAxisStep; // Шаг по оси Y
    this.yRatio;
    this.xRatio;
  }

  parseData(data) {
    const { columns, types, colors } = data;

    console.log(data);

    columns.forEach((cordsArray) => {
      const [type, ...rest] = cordsArray;

      if (types[type] === "x") {
        this.xLine = rest;
      }

      if (types[type] !== "line") {
        return;
      }

      this.computeBoundaries(rest);

      this.yLines.push({
        value: rest,
        color: colors[type],
      });

      this.createyLinesCoordArray(rest, colors[type]);
    });
  }

  // Считаем min-max
  computeBoundaries(yLine) {
    yLine.forEach((yCoord) => {
      if (typeof this.yMin !== "number") this.yMin = yCoord;
      if (typeof this.yMax !== "number") this.yMax = yCoord;

      if (this.yMin > yCoord) this.yMin = yCoord;
      if (this.yMax < yCoord) this.yMax = yCoord;
    });

    const diff = this.yMax - this.yMin;
    this.yAxisStep = diff / this.rowCount;
    this.yRatio = this.viewHeight / diff;
    this.xRatio = this.viewWidth / (this.xLine.length - 2);
  }

  // Создаем массив координат
  createyLinesCoordArray(array, color) {
    const yHighCoord = this.totalHeight - this.padding; // Самая высокая точка Y за вычетом паддинга
    const resultArray = [];

    for (let j = 0; j < array.length; j++) {
      const y = array[j];

      const resultX = Math.round(j * this.xRatio);
      const resultY = Math.round(yHighCoord - y * this.yRatio);
      /**
       * У canvas отчет идет с верхнего левого угла.
       * Вычитая, Я как бы меняю систему координат, начиная отсчитывать точку снизу слева, как "правильнее".
       */
      resultArray.push([resultX, resultY]);
    }

    this.yLinesCoords.push({
      color: color,
      coords: resultArray,
    });
  }
}

const mainCanvas = new Sizes({
  width: 600,
  height: 200,
  padding: 20,
  rowCount: 5,
});
const sliderCanvas = new Sizes({
  width: 600,
  height: 50,
  padding: 5,
  rowCount: 0,
});

export { mainCanvas as SIZES, sliderCanvas as SIZES_SLIDER };
