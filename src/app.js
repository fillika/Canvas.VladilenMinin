import "./styles.scss";
import { canvas, sliderCanvas } from "./modules/Canvas";
import { SIZES, SIZES_SLIDER } from "./modules/Sizes";
import { proxy } from "./modules/Proxy";
import { draw, drawSliderChart } from "./modules/draw";
import { setPosition, setStyles, css } from "./modules/utils";
import getChartData from "./data";

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

  const root = document.querySelector('[data-el="slider"]');

  try {
    let isDraggable = false;
    let startPosition; // Место, откуда начали
    let distance = 0;
    let currentRight = undefined;
    //isDraggable - зажата ли клавиша мыши

    // DOM-els
    const DOM_ELS = {
      left: root.querySelector('[data-el="left"]'),
      window: root.querySelector('[data-el="window"]'),
      right: root.querySelector('[data-el="right"]'),
    };

    setPosition(DOM_ELS, 0, 120);

    window.addEventListener("mousedown", () => {
      const { clientX, target } = event;
      currentRight = DOM_ELS.window.style.right;
      startPosition = clientX;
      isDraggable = true;

      if (target === DOM_ELS.window) {
        window.addEventListener("mousemove", mousemoveSlider);
      }
    });

    window.addEventListener("mouseup", (event) => {
      const { clientX, target } = event;
      isDraggable = false;

      window.removeEventListener("mousemove", mousemoveSlider);
    });

    function mousemoveSlider(event) {
      const { clientX, target } = event;

      distance = clientX - startPosition;

      if (currentRight) {
        const result = Number(currentRight.replace("px", "")) - distance;
        const w = Math.round(DOM_ELS.window.getBoundingClientRect().width);
        setPosition(DOM_ELS, result, w);
      }
    }
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
