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
  // TODO Добавить resize
  const { width, height, totalWidth, totalHeight } = sizes;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  canvas.width = totalWidth;
  canvas.height = totalHeight;
}

function css(el, styles) {
  Object.assign(el.style, styles);
}

/**
 * Функция поиска максимального размера длины строки
 * @param {Array} textArr - массив строк для tooltip
 * @returns {string}
 */
function textWithMaxLenght(textArr) {
  let maxLenghtText = "";
  textArr.forEach((data) => {
    data.text.toString().length > maxLenghtText.length
      ? (maxLenghtText = data.text.toString())
      : false;
  });
  return maxLenghtText;
}

function setPosition({ left, window, right }, rightPos) {
  const w = 150;
  // Меняем позицию элементов в слайдере
  css(left, {
    right: `${rightPos + w}px`,
  });
  css(window, {
    width: `${w}px`,
    right: `${rightPos}px`,
  });
  css(right, {
    width: `${rightPos}px`,
  });
}
export {
  toDate,
  isCurrentPosition,
  setStyles,
  css,
  textWithMaxLenght,
  setPosition,
};
