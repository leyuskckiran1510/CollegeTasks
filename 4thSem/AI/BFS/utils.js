class Grid {
    /*
        Take a Box with :-
        start postion and end position
        with cell height and width 
    */
    constructor(start_pos, end_pos, cell_width, cell_height,cols,rows) {
        this.start_pos = start_pos
        this.end_pos = end_pos
        this.width = cell_width
        this.height = cell_height
        this.cols = cols
        this.rows = rows
    }

    is_inside(x, y) {
        return (
            x >= this.start_pos[0] 
            && x <= this.end_pos[0] 
            && y >= this.start_pos[1] 
            && y <= this.end_pos[1]
        )
    }

    index_of(x, y) {
        if (!this.is_inside(x, y)) {
            return (-1, -1)
        }
        return [
            Math.floor((x - this.start_pos[0]) / this.width),
            Math.floor((y - this.start_pos[1]) / this.height)]

    }

    pos_from_index(x_indx, y_indx) {
        return [
            this.start_pos[0] + (this.width * x_indx),
            this.start_pos[1] + (this.height * y_indx),
        ]

    }
}




let generateGrid = (canvas, context, cols, rows) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    let start_pos = [0, 0]
    let end_pos = [canvas.width, canvas.height]
    let width = ((end_pos[0] - start_pos[0]) / cols)
    let height = ((end_pos[1] - start_pos[1]) / rows)
    let grid = new Grid(start_pos, end_pos, width, height,cols,rows)
    for (let row = 0; row <= rows; row++) {
        for (let col = 0; col <= cols; col++) {
            context.strokeRect(
                (col * width), (row * height),
                width * (1 + col), height * (1 + row),
            );

        }
    }
    return grid
}

let colorCell = (canvas,context, x, y, color) => {
    let [c_w, c_h] = [canvas.clientWidth, canvas.clientHeight]
    let acc_x = (((x -  canvas.offsetLeft) / c_w) * __canvasWidth)
    let acc_y = (((y - canvas.offsetTop) / c_h) * __canvasHeight)
    let _old = context.fillStyle
    context.fillStyle = color;
    context.fillRect(
        ...GRID.pos_from_index(...GRID.index_of(acc_x, acc_y)),
        GRID.width, GRID.height
    );
    context.fillStyle = _old;
}
let colorCellByIndex = (_canvas,context, xi, yi, color) => {
    let _old = context.fillStyle
    context.fillStyle = color;
    context.fillRect(
        ...GRID.pos_from_index(xi,yi),
        GRID.width, GRID.height
    );
    context.fillStyle = _old;
}