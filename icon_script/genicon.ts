import * as fs from "fs";
import * as nunjucks from "nunjucks";

import * as font from "./font";

// Global constants for the drawing
const hSpace = 32;
const vSpace = 22;
const hSize = 14;
const vSize = 24;
const hMargin = 87;
const vMargin = 22;

// Main program
nunjucks.configure({ autoescape: true });

let bits = font.drawString("Prop.");
bits.push(bits[0].map(() => false));

let bits2 = font.drawSpace(1);
font.drawString("Font", bits2);
font.drawSpace(1, bits2);
bits = bits.concat(bits2);

const numRows = bits.length;
const numCols = bits[0].length;
const data = {
  width: hMargin * 2 + hSize + (hSize + hSpace) * (numCols - 1),
  height: vMargin * 2 + vSize + (vSize + vSpace) * (numRows - 1),
  leds: []
};
for (let row = 0; row < numRows; ++row) {
  for (let col = 0; col < numCols; ++col) {
    data.leds.push({
      x: hMargin + (hSize + hSpace) * col,
      y: vMargin + (vSize + vSpace) * row,
      isOn: bits[row][col]
    });
  }
}

let inText = fs.readFileSync("icon_svg_template.nunjucks", "utf8");
let outText = nunjucks.renderString(inText, data);
fs.writeFileSync("icon.svg", outText, "utf8");
