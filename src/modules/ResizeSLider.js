import { SIZES_SLIDER } from "./Sizes";
import { css } from "./utils";

function resizeSlider() {
  const root = document.querySelector('[data-el="slider"]');

  const _$ = {
    isDraggable: false,
    startPosition: null,
    currentRight: null,
    distance: 0,
  };
  // DOM-els
  const DOM_ELS = {
    left: root.querySelector('[data-el="left"]'),
    window: root.querySelector('[data-el="window"]'),
    right: root.querySelector('[data-el="right"]'),
  };

  const state = {
    rightPos: SIZES_SLIDER.totalWidth * 0.1,
    rightArrowWidth: 0,
    windowWidth: SIZES_SLIDER.totalWidth * 0.1,
    minWidth: SIZES_SLIDER.totalWidth * 0.1,
  };

  function mouseMoveLeftArrow(event) {
    const { clientX } = event;

    _$.distance = clientX - _$.startPosition;
    let resultLeft = state.rightPos - _$.distance;
    let resultWidth = resultLeft - state.rightArrowWidth;

    if (resultLeft >= SIZES_SLIDER.width) {
      return;
    }

    if (resultWidth <= state.minWidth) {
      return;
    }

    css(DOM_ELS.left, {
      right: `${resultLeft}px`,
    });

    css(DOM_ELS.window, {
      width: `${resultWidth}px`,
    });
  }

  function mouseMoveRightArrow(event) {
    const { clientX } = event;

    _$.distance = clientX - _$.startPosition;
    let resultRight = state.rightArrowWidth - _$.distance;
    let resultWidth = state.windowWidth + _$.distance;

    if (resultWidth < state.minWidth) {
      return;
    }

    if (resultRight <= 0) {
      return;
    }

    css(DOM_ELS.right, {
      width: `${resultRight}px`,
    });

    css(DOM_ELS.window, {
      width: `${resultWidth}px`,
      right: `${resultRight}px`,
    });
  }

  DOM_ELS.left
    .querySelector('[data-el="left"][data-type="arrow"]')
    .addEventListener("mousedown", (event) => {
      const { clientX } = event;

      _$.isDraggable = true;
      _$.startPosition = clientX;

      state.rightPos = Number(DOM_ELS.left.style.right.replace("px", ""));
      state.rightArrowWidth = Math.round(
        DOM_ELS.right.getBoundingClientRect().width
      );
      window.addEventListener("mousemove", mouseMoveLeftArrow);
    });

  DOM_ELS.right
    .querySelector('[data-el="right"][data-type="arrow"]')
    .addEventListener("mousedown", (event) => {
      const { clientX } = event;

      _$.isDraggable = true;
      _$.startPosition = clientX;

      state.rightArrowWidth = Math.round(
        DOM_ELS.right.getBoundingClientRect().width
      );
      window.addEventListener("mousemove", mouseMoveRightArrow);
    });

  window.addEventListener("mouseup", function (event) {
    if (_$.isDraggable) {
      _$.isDraggable = false;
      window.removeEventListener("mousemove", mouseMoveLeftArrow);
      window.removeEventListener("mousemove", mouseMoveRightArrow);

      state.rightPos = Number(DOM_ELS.left.style.right.replace("px", ""));
      state.rightArrowWidth = DOM_ELS.right.getBoundingClientRect().width;
      state.windowWidth = DOM_ELS.window.getBoundingClientRect().width;
    }
  });

  setP(DOM_ELS, state);
}

function setP(DOM_ELS, state) {
  css(DOM_ELS.left, {
    right: `${state.rightPos}px`,
  });

  css(DOM_ELS.window, {
    width: `${state.windowWidth}px`,
    right: `${state.rightArrowWidth}px`,
  });

  css(DOM_ELS.right, {
    width: `${state.rightArrowWidth}px`,
  });
}

// Установка значения по умолчанию

export { resizeSlider };
