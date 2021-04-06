import "./styles.scss";
import { canvas } from "./modules/Canvas";
import { SIZES } from "./modules/Sizes";
import { proxy } from "./modules/Proxy";
import { draw } from "./modules/draw";
import { setStyles } from "./modules/utils";
import getChartData from "./data";

chart(canvas, getChartData());

/**
 * Основная функция инициализации Canvas
 * @param {HTMLCanvasElement} canvas
 * @param {Array[]} data
 */
function chart({ canvas, ctx }, data) {
  SIZES.parseData(data);
  console.log(SIZES);

  // Styles
  setStyles(canvas, SIZES);
  // draw
  draw(ctx);
  // addListener
  canvas.addEventListener("mousemove", mousemove);
  canvas.addEventListener("mouseleave", mouseleave);

  return {
    destroy() {
      cancelAnimationFrame(canvas.reqAnimFrame);
      canvas.removeEventListener("mousemove", mousemove);
      canvas.removeEventListener("mouseleave", mouseleave);
    },
  };
}

// listeners
function mousemove({ offsetX }) {
  proxy.mouseCoords = {
    x: offsetX * SIZES.dpi,
  };
}

function mouseleave() {
  proxy.mouseCoords = undefined;
}
