// import { setStyles, SIZES } from "./src/utils";

class Sizes {
  constructor() {
    this.width = 600;
    this.height = 200;
    this.dpi = 2;
    this.totalWidth = this.width * this.dpi;
    this.totalHeight = this.height * this.dpi;
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
  setStyles(canvas, SIZES);

  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#282c35';
  for (const [x, y] of data) {
    /**
     * У canvas отчет идет с верхнего левого угла. Вычитая, Я как бы меняю систему координат, начиная отсчитывать точку снизу слева, как "правильнее"
     */
    ctx.lineTo(x, SIZES.totalHeight - y);
  }
  ctx.stroke();
  ctx.closePath();
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
