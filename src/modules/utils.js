import { SIZES } from "./Sizes";

function toDate(timestamp) {
  const shortMonth = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const date = new Date(timestamp);
  return `${shortMonth[date.getMonth()]} ${date.getDate()}`;
}

/**
 * Метод, который определяет, находится ли курсор мыши на определенных координатах
 */
function isCurrentPosition(mouseCoords, x) {
  if (mouseCoords === undefined) return;

  const itemWidth = SIZES.totalWidth / SIZES.xLine.length; // длина 1 отрезка
  const result = Math.abs(x - mouseCoords.x) < itemWidth / 2;
  return result;
}

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

export { toDate, isCurrentPosition,  setStyles};
