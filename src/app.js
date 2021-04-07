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

  const _$ = {
    isDraggable: false,
    startPosition: null,
    currentRight: null,
    distance: 0,
  };

  // Styles
  setStyles(canvas, SIZES_SLIDER);
  // draw
  drawSliderChart(ctx);

  const root = document.querySelector('[data-el="slider"]');

  try {
    // DOM-els
    const DOM_ELS = {
      left: root.querySelector('[data-el="left"]'),
      window: root.querySelector('[data-el="window"]'),
      right: root.querySelector('[data-el="right"]'),
    };

    const state = {
      rightPos: 150,
      rightArrowWidth: 50,
    };

    setP();
    function setP() {
      css(DOM_ELS.left, {
        right: `${state.rightPos}px`,
      });

      css(DOM_ELS.window, {
        width: `${state.rightPos - state.rightArrowWidth}px`,
        right: `${state.rightArrowWidth}px`,
      });

      css(DOM_ELS.right, {
        width: `${state.rightArrowWidth}px`,
      });
    }
    // Установка значения по умолчанию

    DOM_ELS.left
      .querySelector('[data-el="left"][data-type="arrow"]')
      .addEventListener("mousedown", (event) => {
        const { currentTarget, clientX } = event;

        // TODO - получить значения на момент клика и работать с ними

        _$.isDraggable = true;
        _$.startPosition = clientX;

        state.rightPos = Number(DOM_ELS.left.style.right.replace("px", ""));
        state.rightArrowWidth = Math.round(
          DOM_ELS.right.getBoundingClientRect().width
        );
        window.addEventListener("mousemove", mouseMoveLeftArrow);
      });

    window.addEventListener("mouseup", function (event) {
      if (_$.isDraggable) {
        _$.isDraggable = false;
        window.removeEventListener("mousemove", mouseMoveLeftArrow);
      }
    });

    function mouseMoveLeftArrow(event) {
      const { clientX } = event;

      _$.distance = clientX - _$.startPosition;
      let resultLeft = state.rightPos - _$.distance;

      if (resultLeft >= SIZES_SLIDER.width) {
        resultLeft = SIZES_SLIDER.width;
      }

      if (resultLeft <= state.rightArrowWidth) {
        resultLeft = state.rightArrowWidth;
      }

      css(DOM_ELS.left, {
        right: `${resultLeft}px`,
      });

      css(DOM_ELS.window, {
        width: `${resultLeft - state.rightArrowWidth}px`,
      });
    }

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
