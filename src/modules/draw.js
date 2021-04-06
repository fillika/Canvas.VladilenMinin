import { SIZES } from "./Sizes";
import { proxy } from "./Proxy";
import { toDate, isCurrentPosition } from "./utils";
import { template } from "../tooltip";

function drawYAxis(ctx) {
  ctx.beginPath();
  ctx.strokeStyle = "#bbb";
  ctx.font = "normal 20px Helvetica, sans-serif";
  ctx.fillStyle = "#96a2aa";
  ctx.lineWidth = 1;

  for (let index = 1; index <= SIZES.rowCount; index++) {
    const yWithoutPadding = SIZES.step * index; // Тут считаем значение
    const yWithPadding = yWithoutPadding + SIZES.padding; // Тут рисуем (визуал, а поэтому учитываем паддинги)

    // Вычитаем из максимума, чтобы поменять визуально начало отсчета (чтобы оно стало снизу слева)
    ctx.fillText(
      Math.round(SIZES.yMax - SIZES.yAxisStep * index),
      5,
      yWithPadding - 5
    );
    ctx.moveTo(0, yWithPadding);
    ctx.lineTo(SIZES.totalWidth, yWithPadding);
  }

  ctx.stroke();
  ctx.closePath();
}

function drawXAxis(ctx, proxy) {
  const { mouseCoords } = proxy;
  const colsCount = 7;
  const step = Math.round(SIZES.xLine.length / colsCount);

  // -----
  ctx.beginPath();
  ctx.strokeStyle = "#bbb";
  ctx.font = "normal 20px Helvetica, sans-serif";
  ctx.fillStyle = "#96a2aa";

  for (let index = 0; index < SIZES.xLine.length; index++) {
    const xValue = SIZES.xLine[index];
    const date = toDate(xValue);
    const resultX = index * SIZES.xRatio;

    if (index % step === 0) {
      ctx.fillText(date, resultX, SIZES.totalHeight - 5);
    }

    if (isCurrentPosition(mouseCoords, resultX)) {
      // TODO Здесь формируем tooltip
      // Выводим date
      // SIZES.yLines.forEach(line => console.log(line.coords[index])) // Получаем данные по каждой линии
      drawVerticalLine(ctx, mouseCoords);
    }
  }

  ctx.stroke();
  ctx.closePath();
  // -----
}

function drawDataLines(ctx, { coords, color }) {
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.strokeStyle = color;

  for (let j = 0; j < coords.length; j++) {
    const [x, y] = coords[j];
    ctx.lineTo(x, y);
  }

  ctx.stroke();
  ctx.closePath();
}

function drawVerticalLine(ctx, coords) {
  if (coords === undefined) return;

  const lineWidth = 2;
  const xCoord = coords.x + lineWidth;
  ctx.save();

  ctx.lineWidth = lineWidth;
  ctx.lineTo(xCoord, SIZES.padding / 2);
  ctx.lineTo(xCoord, SIZES.totalHeight - SIZES.padding);

  ctx.restore();
}

function drawCircle(ctx, { coords, color }) {
  const radius = 3 * SIZES.dpi;
  ctx.beginPath();
  ctx.lineWidth = 2 * SIZES.dpi;
  ctx.strokeStyle = color;

  for (let k = 0; k < coords.length; k++) {
    const [x, y] = coords[k];
    if (isCurrentPosition(proxy.mouseCoords, x)) {
      ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
      break; // Чтобы не рисовалось 2 кружков, которые рядом
    }
  }

  ctx.stroke();
  ctx.closePath();
}

// main draw function
function draw(ctx) {
  clearCanvas(ctx);

  // === y axis
  drawYAxis(ctx);

  // === x axis
  drawXAxis(ctx, proxy);

  // MainLines and circles
  SIZES.yLinesCoords.forEach((coordsArr) => {
    drawDataLines(ctx, coordsArr);
    drawCircle(ctx, coordsArr);
  });
}

function clearCanvas(ctx) {
  ctx.clearRect(0, 0, SIZES.totalWidth, SIZES.totalHeight);
}

export {
  drawYAxis,
  drawXAxis,
  drawDataLines,
  drawVerticalLine,
  drawCircle,
  draw,
  clearCanvas,
};
