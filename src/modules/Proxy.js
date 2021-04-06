import { canvas } from "./Canvas";
import { draw } from "./draw";

// Proxy
const proxy = new Proxy(
  {},
  {
    set(...args) {
      const result = Reflect.set(...args);
      canvas.reqAnimFrame = requestAnimationFrame(() => draw(canvas.ctx));
      return result;
    },
  }
);

export { proxy };
