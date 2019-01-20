# Proportional font for micro:bit

This is a proportional font for the micro:bit.
The font is more condensed than the system font, because most characters are
less than 5 pixels wide.

Here are the features of this package:
- Narrower text, i.e. more efficient use of the LED display.
- The "interval" of the show number/string blocks are settable.
- A show space block, that scrolls a specified number of blank columns.
- Text/number is always scrolled regardless of its length.

## Blocks in the proportional font package

Two blocks are available to show number and string.
```blocks
proportionalFont.showNumber(1234, 150)
```

```blocks
proportionalFont.showString("test okay", 150)
```

The next one shows the specified number of empty columns.
This is needed to add space between two show number/show string commands.
```blocks
proportionalFont.showSpace(1, 150)
```

And two more blocks are available to calculate the width (in pixels) of a string/number:

```blocks
let width1: number = proportionalFont.getWidthOfNumber(1234)
```

```blocks
let width2: number = proportionalFont.getWidthOfString("test okay")
```

These widths can be used to calculate the time needed to show the text.
The time is calculated by the formula.

> **time needed = width of text in pixels × interval**.

Consider the following code:

```blocks
proportionalFont.showString("Prop. Font", 150)
```
In this case, the text “Prop. Font” is 35 pixels wide.
And the time needed to show the text “Prop. Font” is 35 × 150 ms = 5250 ms.

(P.S. the actual time elapsed will be a little bit higher than the calculated
time.)


## Typescript reference

```typescript
// Output to LED. The second number is the per-column interval in milliseconds.
// If the interval is not specified, it is 150 ms (same as the core).
proportionalFont.showNumber(1234)
proportionalFont.showNumber(1234, 100)
proportionalFont.showString("test okay")
proportionalFont.showString("test okay", 100)

// Output the given number of empty columns to the LED. Again, the second number
// is the interval in milliseconds, which defaults to 150.
proportionalFont.showSpace(2)
proportionalFont.showSpace(2, 100)

// Get the width in pixel of the specified number or string.
let width1: number = proportionalFont.getWidthOfNumber(1234)
let width2: number = proportionalFont.getWidthOfString("test okay")
```

## License

The code is available via MIT license.

## Supported targets

* for PXT/microbit
