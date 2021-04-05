// import { setStyles, SIZES } from "./src/utils";

class Sizes {
  constructor() {
    this.width = 600;
    this.height = 200;
    this.dpi = 2;
    this.padding = 40;
    this.totalWidth = this.width * this.dpi;
    this.totalHeight = this.height * this.dpi;
    this.viewHeight = this.totalHeight - this.padding * 2;
    this.rowCount = 5;
    this.step = this.viewHeight / this.rowCount;
  }
}

const SIZES = new Sizes();

/**
 * Функция применения стилей к канвасу. Размеры, разрешение и т.д.
 * @param {HTMLCanvasElement} canvas
 * @param {Number} dpi
 */
function setStyles(canvas, sizes) {
  const { width, height, totalWidth, totalHeight } = sizes;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  canvas.width = totalWidth;
  canvas.height = totalHeight;
}

/**
 * Основная функция инициализации Canvas
 * @param {HTMLCanvasElement} canvas
 * @param {Array[]} data
 */
function chart(canvas, data) {
  const ctx = canvas.getContext("2d");
  // Styles
  setStyles(canvas, SIZES);

  // === y axis
  drawYAxis(ctx);

  // MainLine
  drawMainLine(ctx, data);
}

chart(document.getElementById("chart"), [
  [0, 0],
  [200, 200],
  [400, 100],
  [450, 120],
  [550, 80],
  [580, 100],
  [650, 20],
]);

/** Utils */
function drawYAxis(ctx) {
  ctx.beginPath();
  ctx.strokeStyle = "#bbb";
  ctx.font = "normal 20px Helvetica, sans-serif";
  ctx.fillStyle = "#96a2aa";

  console.log(SIZES.padding);

  for (let index = 1; index <= SIZES.rowCount; index++) {
    const yWithoutPadding = SIZES.step * index; // Тут считаем значение
    const yWithPadding = yWithoutPadding + SIZES.padding; // Тут рисуем (визуал, а поэтому учитываем паддинги)

    ctx.fillText(SIZES.totalHeight - yWithoutPadding, 5, yWithPadding - 5);
    ctx.moveTo(0, yWithPadding);
    ctx.lineTo(SIZES.totalWidth, yWithPadding);
  }

  ctx.stroke();
  ctx.closePath();
}

function drawMainLine(ctx, data) {
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#282c35";

  for (const [x, y] of data) {
    const xTotalCoord = SIZES.totalHeight - SIZES.padding;
    /**
     * У canvas отчет идет с верхнего левого угла. Вычитая, Я как бы меняю систему координат, начиная отсчитывать точку снизу слева, как "правильнее"
     */
    ctx.lineTo(x, xTotalCoord - y);
  }

  ctx.stroke();
  ctx.closePath();
}
