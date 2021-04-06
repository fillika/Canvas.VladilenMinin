import { css } from "./modules/utils";

const template = (data) => `
  <div class="tooltip-title">${data.title}</div>
  <ul class="tooltip-tist">
    ${data.items
      .map(
        (item) => `
        <li class="tooltip-list-item">
          <div class="value" style="color: ${item.color}">${item.value}</div>
          <div class="name" style="color: ${item.color}">${item.name}</div>
        </li>
      `
      )
      .join("\n")}
  </ul>
`;

export default function tooptip(el) {
  return {
    show() {},
    hide() {
      css(el, {
        display: "none",
      });
    },
  };
}

export { template };
