import { Component } from "../types";

export const card: Component = (
  rounded: string = 'rounded-md',
  shadow: string = 'shadow-md'
) => {
  return `
    <div class=" p-2 ${rounded} ${shadow} "></div>
    `;
};
