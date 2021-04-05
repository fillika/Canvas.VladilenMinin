const SIZES = {
  width: 600,
  height: 200,
  dpi: 2
};

function chart(canvas, data) {
  const ctx = canvas.getContext("2d");
  setStyles(canvas, SIZES.dpi);
}

function setStyles(canvas, dpi) {
  canvas.style.width = SIZES.width + "px";
  canvas.style.height = SIZES.height + "px";
  canvas.width = SIZES.width * dpi;
  canvas.height = SIZES.height * dpi;
}

chart(document.getElementById("chart"));
