// Copyright 2018-2019 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a MIT License, that can
// be found in the LICENSE file.

//% color="#1E66A6"
//% block="Prop. Font"
//% icon="\uf031"
//% groups=["LED output", "Measurement"]
namespace proportionalFont {
  // The font data for ASCII codes 32 to 126. The glyph of each character is a
  // number in Int32LE (typed in hexadecimals). The numbers are concatenated to
  // form the buffer.
  // Format (bit 0 = lowest bit):
  //   bits 0 to 2:  width of character (max = 5)
  //   bits 3 to 7:  column 0 (bit 3 = row 0, bit 4 = row 1, etc.)
  //   bits 8 to 27 (if any): columns 1 to 4
  const fontData = hex`
    01000000 B9000000 1B600000 555F7D05 45EA2B01 9D8BE80C 45F7220A 19000000
    72110000 8A0E0000 55E41305 25E41302 82180000 25841002 81000000 C3640000
    73D10100 121F0000 93D90200 8B550100 64EA2300 BB350100 73350100 0B7D0000
    53550100 93D50100 51000000 821A0000 2544A908 554A2905 8D4A1102 0B550000
    75B17709 F3C90300 FB550100 73310200 FBD10100 FB350200 FB250000 73B10100
    FBE40300 8B3F0200 43F10100 FB640300 FB100200 FD82880F FC827C00 73D10100
    FB450000 73D90300 FB450300 93350100 0B3F0000 FBF00300 3BF80000 3DD8E003
    DB640300 3BFC0000 CB750200 FA110000 1B040300 8A1F0000 33C10000 83100200
    0A020000 43940300 FB140100 43940200 43F40300 639A0200 23BE0000 A39A0300
    FB040300 D1000000 821D0000 FB880200 7A100000 E504130C E3040300 43140100
    F38A0000 23CA0300 E3840000 A21A0000 239E0200 63900300 63900100 65104106
    A3880200 B3D80100 D2160000 233F0200 F9000000 8B9F0000 25822002`;
  const fontDataLength: number = 95;

  /**
   * Obtain the character in the font. Return space if not in list.
   */
  function getGlyph(code: number): number {
    let index: number = code - 32;
    if (index < 0 || index >= fontDataLength) index = 0;
    return fontData.getNumber(NumberFormat.Int32LE, index << 2);
  }

  /**
   * Obtain the width of a character in the font.
   */
  function getGlyphWidth(glyph: number): number {
    return glyph & 7;
  }

  /**
   * Obtain the column of a character in the font.
   */
  function getColumn(glyph: number, col: number): number {
    return (glyph >> (3 + col * 5)) & 31;
  }

  /**
   * Display the column by scrolling the display to the left by 1 pixel.
   */
  function displayColumn(data: number) {
    let brightness = led.brightness();
    for (let row = 0; row < 5; ++row) {
      for (let col = 0; col < 4; ++col) {
        led.plotBrightness(col, row, led.point(col + 1, row) ? brightness : 0);
      }
      led.plotBrightness(4, row, (data & 1) > 0 ? brightness : 0);
      data >>= 1;
    }
  }

  /**
   * Scroll some text on the screen, with the given speed of scroll per pixel.
   * @param interval Speed of scroll; eg: 150, 100, 200
   */
  //% block="show number %num speed (ms) %interval" blockGap=8
  //% group="LED output"
  export function showNumber(num: number, interval: number = 150) {
    showString(num.toString(), interval);
  }

  /**
   * Scroll some text on the screen, with the given speed of scroll per pixel.
   * @param interval Speed of scroll; eg: 150, 100, 200
   */
  //% block="show string %text speed (ms) %interval" blockGap=8
  //% group="LED output"
  export function showString(text: string, interval: number = 150) {
    let length: number = text.length;
    let col: number = 0;
    for (let pos: number = 0; pos < length; pos++) {
      let glyph: number = getGlyph(text.charCodeAt(pos));
      let glyphWidth: number = getGlyphWidth(glyph);

      while (col < glyphWidth) {
        // If col < 0, set columnData to 0 for empty column.
        let columnData: number = col < 0 ? 0 : getColumn(glyph, col);
        displayColumn(columnData);
        col++;
        basic.pause(interval);
      }
      col = -1; // Pad one empty column in the next character.
    }
  }

  /**
   * Scroll the specified columns of space on the screen, with the given speed
   * of scroll per pixel.
   * @param cols Number of columns; eg: 1, 2, 3
   * @param interval Speed of scroll; eg: 150, 100, 200
   */
  //% block="show space cols %cols speed (ms) %interval" blockGap=8
  //% group="LED output"
  export function showSpace(cols: number = 1, interval: number = 150) {
    for (let col: number = 0; col < cols; col++) {
      displayColumn(0);
      basic.pause(interval);
    }
  }

  /**
   * Get the width of the number, in the number of LED columns.
   */
  //% block="get width of %text" blockGap=8
  //% group="Measurement"
  export function getWidthOfNumber(num: number): number {
    return getWidthOfString(num.toString());
  }

  /**
   * Get the width of the string, in the number of LED columns.
   */
  //% block="get width of %text" blockGap=8
  //% group="Measurement"
  export function getWidthOfString(text: string): number {
    let length: number = text.length;
    let totalWidth: number = length - 1;

    for (let pos: number = 0; pos < length; pos++) {
      let glyph: number = getGlyph(text.charCodeAt(pos));
      totalWidth += getGlyphWidth(glyph);
    }

    return totalWidth;
  }
}
