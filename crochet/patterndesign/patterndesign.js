const canvas = document.getElementById("canvas");
const generateButton = document.getElementById("generate-shape-button");
const shiftLeftButton = document.getElementById("shift-left-button");
const shiftRightButton = document.getElementById("shift-right-button");

const STITCH_SIZE = 25;

const COLOUR_WHITE = "white";
const COLOUR_BLUE = "lightblue";

const MINIMUM_CANVAS_WIDTH = 250;
const MINIMUM_CANVAS_HEIGHT = 250;

class Stitch {
    x;
    y;

    constructor(colour) {
        this.colour = colour;
    }
}

class CanvasState {
    rows = [];
    gcd = 1;
    canvasWidth = MINIMUM_CANVAS_WIDTH;
    canvasHeight = MINIMUM_CANVAS_HEIGHT;
    rightHanded = true;

    getRows() {
        return this.rows;
    }

    getWidth() {
        return this.canvasWidth;
    }

    getHeight() {
        return this.canvasHeight;
    }

    getRightHanded() {
        return this.rightHanded;
    }

    getLongestRowStitchCount() {
        let longestRowLength = 0;
        for (let i = 0; i < this.rows.length; i++) {
            const currentRow = this.rows[i];
            if (currentRow.length > longestRowLength) {
                longestRowLength = currentRow.length;
            }
        }
        return longestRowLength;
    }

    clearRows() {
        this.rows = [];

        this.updateCanvasState();
    }

    addRow(row) {
        this.rows.push(row);

        this.updateCanvasState();
    }

    addBlankRow(size) {
        const row = [];
        for (let i = 0; i < size; i++) {
            row.push(new Stitch(COLOUR_WHITE));
        }
        this.addRow(row);
    }

    shiftLeft() {
        // Shift left based on the greatest common divisor of all the row lengths.
        // This way we know that we'll be shifting each row evenly such that it will evenly wrap around after gcd shifts.
        // e.g. If each row is a multiple of 6, then shift each row left by row.length / 6, meaning after 6 shifts,
        //   everything will be back where it started.

        if (this.rows.length > 1) {
            // If we have multiple rows, and the row widths are coprime (i.e. gcd === 1), then there's no even way to rotate.
            if (this.gcd === 1) {
                alert("Unable to rotate left, row widths are coprime so cannot be shifted evenly.");
                return;
            }
        }

        for (const row of this.rows) {
            if (row.length === 0) {
                continue;
            }

            const numberOfShifts = row.length / this.gcd;
            for (let i = 0; i < numberOfShifts; i++) {
                const first = row.shift();
                row.push(first);
            }
        }

        this.updateCanvasState();
    }

    shiftRight() {
        // Shift right based on the greatest common divisor of all the row lengths.
        // This way we know that we'll be shifting each row evenly such that it will evenly wrap around after gcd shifts.
        // e.g. If each row is a multiple of 6, then shift each row right by row.length / 6, meaning after 6 shifts,
        //   everything will be back where it started.

        if (this.rows.length > 1) {
            // If we have multiple rows, and the row widths are coprime (i.e. gcd === 1), then there's no even way to rotate.
            if (this.gcd === 1) {
                alert("Unable to rotate right, row widths are coprime so cannot be shifted evenly.");
                return;
            }
        }

        for (const row of this.rows) {
            const reversedRow = clone(row).reverse();

            if (reversedRow.length === 0) {
                continue;
            }

            const numberOfShifts = reversedRow.length / this.gcd;
            for (let i = 0; i < numberOfShifts; i++) {
                const first = reversedRow.shift();
                reversedRow.push(first);
            }

            row.length = 0;
            row.push(...reversedRow.reverse());
        }

        this.updateCanvasState();
    }

    updateCanvasState() {
        // Determine how big the canvas needs to be. Enforce the minimum size.
        this.canvasWidth = Math.max(MINIMUM_CANVAS_WIDTH, this.getLongestRowStitchCount() * STITCH_SIZE);
        this.canvasHeight = Math.max(MINIMUM_CANVAS_HEIGHT, this.rows.length * STITCH_SIZE);

        // Note that the rows will be display bottom up
        const reversedRows = clone(this.rows).reverse();
        for (let i = 0; i < reversedRows.length; i++) {
            // Note: If right-handed mode is active, then the logical rows are
            //   modelled right-to-left. So we need to reverse the row before
            //   calculating the display position.
            const rowInDisplayOrder = this.rightHanded ? clone(reversedRows[i]).reverse() : clone(reversedRows[i]);
            const rowCentre = this.canvasWidth / 2;
            const numberOfStitches = rowInDisplayOrder.length;
            const leftStart = rowCentre - ((numberOfStitches * STITCH_SIZE) / 2);

            for (let j = 0; j < numberOfStitches; j++) {
                const stitch = rowInDisplayOrder[j];
                stitch.x = leftStart + j * STITCH_SIZE;
                stitch.y = i * STITCH_SIZE;
            }
        }

        if (this.rows.length < 2) {
            this.gcd = 1;
        } else {
            let partial_gcd = this.rows[0].length;
            for (let i = 1; i < this.rows.length; i++) {
                partial_gcd = gcd(partial_gcd, this.rows[i].length);
            }
            this.gcd = partial_gcd;
        }
    }
}

const canvasState = new CanvasState();

generateButton.onclick = function () {
    canvasState.clearRows();

    // todo: make this configurable
    canvasState.addRow([...repeated(COLOUR_WHITE, 6)]);
    canvasState.addRow([...repeated(COLOUR_WHITE, 12)])
    canvasState.addRow([...repeated(COLOUR_WHITE, 18)]);
    canvasState.addRow([...repeated(COLOUR_BLUE, 7), ...repeated(COLOUR_WHITE, 17)]);
    canvasState.addRow([...repeated(COLOUR_BLUE, 11), ...repeated(COLOUR_WHITE, 18), ...repeated(COLOUR_BLUE, 1)]);
    canvasState.addRow([...repeated(COLOUR_BLUE, 14), ...repeated(COLOUR_WHITE, 17), ...repeated(COLOUR_BLUE, 5)]);
    canvasState.addRow([...repeated(COLOUR_BLUE, 14), ...repeated(COLOUR_WHITE, 14), ...repeated(COLOUR_BLUE, 1), ...repeated(COLOUR_WHITE, 2), ...repeated(COLOUR_BLUE, 5)]);
    canvasState.addRow([...repeated(COLOUR_BLUE, 14), ...repeated(COLOUR_WHITE, 14), ...repeated(COLOUR_BLUE, 2), ...repeated(COLOUR_WHITE, 1), ...repeated(COLOUR_BLUE, 5)]);
    canvasState.addRow([...repeated(COLOUR_BLUE, 15), ...repeated(COLOUR_WHITE, 13), ...repeated(COLOUR_BLUE, 8)]);
    canvasState.addRow([...repeated(COLOUR_BLUE, 15), ...repeated(COLOUR_WHITE, 13), ...repeated(COLOUR_BLUE, 8)]);
    canvasState.addRow([...repeated(COLOUR_BLUE, 16), ...repeated(COLOUR_WHITE, 12), ...repeated(COLOUR_BLUE, 8)]);
    canvasState.addRow([...repeated(COLOUR_BLUE, 13), ...repeated(COLOUR_WHITE, 11), ...repeated(COLOUR_BLUE, 6)]);
    canvasState.addRow([...repeated(COLOUR_BLUE, 10), ...repeated(COLOUR_WHITE, 10), ...repeated(COLOUR_BLUE, 4)]);
    canvasState.addRow([...repeated(COLOUR_BLUE, 8), ...repeated(COLOUR_WHITE, 6), ...repeated(COLOUR_BLUE, 4)]);
    canvasState.addRow([...repeated(COLOUR_BLUE, 12)]);

    updateCanvas();
}

shiftLeftButton.onclick = function () {
    // Note: If right-handed mode is active, then the logical rows are modelled
    //   right-to-left. So to shift the pattern left means shifting the rows right.
    //   Otherwise, shift the rows to the left.
    if (canvasState.getRightHanded()) {
        canvasState.shiftRight();
    } else {
        canvasState.shiftLeft();
    }
    updateCanvas();
}

shiftRightButton.onclick = function () {
    // Note: If right-handed mode is active, then the logical rows are modelled
    //   right-to-left. So to shift the pattern right means shifting the rows left.
    //   Otherwise, shift the rows to the right.
    if (canvasState.getRightHanded()) {
        canvasState.shiftLeft();
    } else {
        canvasState.shiftRight();
    }
    updateCanvas();
}

function updateCanvas() {
    // Update the size of the canvas
    canvas.setAttribute("width", canvasState.getWidth().toString());
    canvas.setAttribute("height", canvasState.getHeight().toString());

    // Get the 2D context of the canvas
    const ctx = canvas.getContext("2d");

    // Draw each stitch
    for (const row of canvasState.getRows()) {
        for (const stitch of row) {
            ctx.fillStyle = stitch.colour;
            ctx.fillRect(stitch.x, stitch.y, STITCH_SIZE, STITCH_SIZE);
            ctx.fill();
            ctx.strokeStyle = "black"
            ctx.strokeRect(stitch.x, stitch.y, STITCH_SIZE, STITCH_SIZE);
        }
    }
}

function clone(array) {
    return [... array];
}

function gcd(a, b) {
    if (b === 0) {
        return a;
    } else {
        return gcd(b, a % b);
    }
}

function repeated(colour, length) {
    const rows = [];
    for (let i = 0; i < length; i++) {
        rows.push(new Stitch(colour));
    }
    return rows;
}
