class Canvas {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");
    this.reqAnimFrame;
  }
}

class SliderChart {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");
  }
}

const canvas = new Canvas("chart");
const sliderCanvas = new SliderChart("slider-chart");


export {canvas, sliderCanvas};