import { SIZES, SIZES_SLIDER } from "./Sizes";
import { proxy } from "./Proxy";
import { toDate, isCurrentPosition, textWithMaxLenght } from "./utils";

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

// tooltip
// TODO Текст должен быть массивом строк
function drawTooltip(ctx, textArr, startX, angle) {
  const style = {
    fontSize: 12 * SIZES.dpi,
    lineHeight: 12 * SIZES.dpi,
    color: "rgb(40, 44, 53)",
    backgroundColor: "#fff",
    lineWidth: 1 * SIZES.dpi,
    padding: 10,
  };

  let xCoord = startX + style.padding * 2;

  const height = style.lineHeight + textArr.length * style.lineHeight;
  const startY = SIZES.totalHeight / 2 - height;

  ctx.beginPath();
  ctx.font = `normal ${style.lineHeight}px sans-serif`;

  const width =
    Math.round(ctx.measureText(textWithMaxLenght(textArr)).width) +
    style.padding * 2;

  // Понять, уходит ли tooltip за границы canvas
  if (SIZES.totalWidth - xCoord < width) {
    xCoord = xCoord - width - style.padding * 4;
  }

  ctx.strokeStyle = style.color;
  ctx.lineWidth = style.lineWidth;
  ctx.fillStyle = style.backgroundColor;
  ctx.moveTo(xCoord + angle, startY);
  ctx.arcTo(xCoord + width, startY, xCoord + width, startY + height, angle);
  ctx.arcTo(xCoord + width, startY + height, xCoord, startY + height, angle);
  ctx.arcTo(xCoord, startY + height, xCoord, startY, angle);
  ctx.arcTo(xCoord, startY, xCoord + width, startY, angle);
  ctx.fill();
  // text styles and draw
  for (let j = 0; j < textArr.length; j++) {
    ctx.fillStyle = textArr[j].color;
    const element = textArr[j].text;

    ctx.fillText(
      element,
      xCoord + style.padding,
      startY + style.lineHeight + style.padding + style.lineHeight * j
    );
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

  isDrawTooltip(ctx, proxy);
}

function drawSliderChart(ctx) {
  clearCanvas(ctx);

  // MainLines and circles
  SIZES_SLIDER.yLinesCoords.forEach((coordsArr) => {
    drawDataLines(ctx, coordsArr);
    drawCircle(ctx, coordsArr);
  });
}

function isDrawTooltip(ctx, proxy) {
  const { mouseCoords } = proxy;
  const text = [];

  for (let index = 0; index < SIZES.xLine.length; index++) {
    const resultX = index * SIZES.xRatio;

    if (isCurrentPosition(mouseCoords, resultX)) {
      SIZES.yLines.forEach((line) => {
        text.push({
          text: line.value[index],
          color: line.color,
        });
      });

      drawTooltip(
        ctx,
        text,
        mouseCoords.x, // Пока что координата не работает
        10
      );
    }
  }
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
  drawSliderChart,
  clearCanvas,
};
