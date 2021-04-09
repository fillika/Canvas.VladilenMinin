import "./styles.scss";
import { canvas, sliderCanvas } from "./modules/Canvas";
import { SIZES, SIZES_SLIDER } from "./modules/Sizes";
import { proxy } from "./modules/Proxy";
import { draw, drawSliderChart } from "./modules/draw";
import { setPosition, setStyles, css } from "./modules/utils";
import getChartData from "./data";
import { resizeSlider } from "./modules/ResizeSLider";

chart(canvas, getChartData());
sliderChart(sliderCanvas, getChartData());
/**
 * Основная функция инициализации Canvas
 * @param {HTMLCanvasElement} canvas
 * @param {Array[]} data
 */
function chart({ canvas, ctx }, data) {
  SIZES.parseData(data);

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

function sliderChart({ canvas, ctx }, data) {
  SIZES_SLIDER.parseData(data);


  // Styles
  setStyles(canvas, SIZES_SLIDER);
  // draw
  drawSliderChart(ctx);


  try {
    resizeSlider();


    // //////////////////////////
  } catch (error) {
    console.error(error);
  }
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
