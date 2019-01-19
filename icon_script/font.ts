// Copyright 2018-2019 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a MIT License, that can
// be found in the LICENSE file.

type Boolean2DArray = boolean[][];

// The font data from ASCII codes 32 to 126. Index padded by 32.
// Format (bit 0 = lowest bit):
//   bits 0 to 2:  width of character (max = 5)
//   bits 3 to 7:  column 0 (bit 3 = row 0, bit 4 = row 1, etc.)
//   bits 8 to 27 (if any): column 1 to 4
// FIXME: Programs using the library fails to compile if fontData is number[].
const fontData = [
    "1", "185", "24603", "92102485", "19655237", "216566685", "170063685", "25",
    "4466", "3722", "85189717", "34858021", "6274", "34636837", "129", "25795",
    "119155", "7954", "186771", "87435", "2353764", "79291", "79219", "32011",
    "87379", "120211", "81", "6786", "145310757", "86592085", "34687629", "21771",
    "158839157", "248307", "87547", "143731", "119291", "144891", "9723", "110963",
    "255227", "147339", "127299", "222459", "135419", "260604669", "8159996", "119155",
    "17915", "252275", "214523", "79251", "16139", "258299", "63547", "65067069",
    "222427", "64571", "161227", "4602", "197659", "8074", "49459", "135299",
    "522", "234563", "70907", "169027", "259139", "170595", "48675", "236195",
    "197883", "209", "7554", "166139", "4218", "202573029", "197859", "70723",
    "35571", "248355", "34019", "6818", "171555", "233571", "102499", "104927333",
    "166051", "121011", "5842", "147235", "249", "40843", "35684901"];

function getGlyph(code: number): number {
    let index: number = code - 32;
    if (index < 0 || index > fontData.length)
        index = 0;
    return parseInt(fontData[index]);
}

function getGlyphWidth(glyph: number): number {
    return glyph & 7;
}

function getColumn(glyph: number, col: number): number {
    return (glyph >> (3 + col * 5)) & 31;
}

function addColumnToArray(column: number, output: Boolean2DArray) {
    // Allow output to a shorter or longer array, where all the extra elements are filled to false.
    let numRows = output.length;
    for (let row = 0; row < numRows; ++row) {
        output[row].push(column & 1 ? true : false);
        column >>= 1;
    }
}

export function drawSpace(cols: number, appendTo?: Boolean2DArray): Boolean2DArray {
    let result: Boolean2DArray = appendTo || [[], [], [], [], []];

    for (let col: number = 0; col < cols; col++) {
        addColumnToArray(0, result);
    }

    return result;
}

export function drawNumber(num: number, appendTo?: Boolean2DArray): Boolean2DArray {
    return drawString(num.toString(), appendTo)
}

export function drawString(text: string, appendTo?: Boolean2DArray): Boolean2DArray {
    let length: number = text.length;
    let col: number = 0;
    let result: Boolean2DArray = appendTo || [[], [], [], [], []];

    for (let pos: number = 0; pos < length; pos++) {
        let glyph: number = getGlyph(text.charCodeAt(pos));
        let glyphWidth: number = getGlyphWidth(glyph);

        while (col < glyphWidth) {
            // If col < 0, set columnData to 0 for empty column.
            let columnData: number = col < 0 ? 0 : getColumn(glyph, col);
            addColumnToArray(columnData, result);
            col++;
        }
        col = -1;  // Pad one empty column in the next character.
    }

    return result;
}

export function getWidthOfNumber(num: number): number {
    return getWidthOfString(num.toString());
}

export function getWidthOfString(text: string): number {
    let length: number = text.length;
    let totalWidth: number = length - 1;

    for (let pos: number = 0; pos < length; pos++) {
        let glyph: number = getGlyph(text.charCodeAt(pos));
        totalWidth += getGlyphWidth(glyph);
    }

    return totalWidth;
}
