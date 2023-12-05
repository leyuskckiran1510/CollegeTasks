// Types
const ROOT_NODE = 0
const SRC_NODE = 0
const PATH_NODE = 1
const FINAL_NODE = 2
const print = console.log
var nodeCollection = new Array()


class Node {
    constructor(value, type, ix, iy) {
        this.value = value
        this.type = type
        this.ix = ix 
        this.iy = iy
        this.childs = new Array()
        this.traversed = false
        this.owned = false
    }
}

let bFs = (...root_node) => {
    let my_slice = root_node
    if (my_slice.length == 0) {
        return
    }
    my_slice = my_slice.concat(my_slice[0].childs)
    let visted = my_slice.splice(0, 1)[0]
    if (visted.type == ROOT_NODE)
        colorCellByIndex(canvas, context, visted.ix, visted.iy, "red")
    else if (visted.type == PATH_NODE)
        colorCellByIndex(canvas, context, visted.ix, visted.iy, "yellow")
    else if (visted.type == FINAL_NODE)
        colorCellByIndex(canvas, context, visted.ix, visted.iy, "green")
    else
        colorCellByIndex(canvas, context, visted.ix, visted.iy, "blue")
    visted.traversed = true
    setTimeout(() => {
        bFs(...my_slice)
    }, 0)
}


let direcs = [
    // front ->middle/top/down
    [1, 0],
    [1, -1],
    [1, 1],
    
    // back ->middle/top/down
    [-1, 0],
    [-1, -1],
    [-1, 1],

    // center ->middle/top/down
    [0, 1],
    [0, -1],
]

let createNodes = (rows, cols) => {
    nodeCollection = new Array()
    //create Nodes
    for (let row = 0; row < rows; row++) {
        let _temp = []
        for (let col = 0; col < cols; col++) {
            let [px,py] = GRID.pos_from_index(col,row)
            let colValue = context.getImageData(px,py, 1, 1).data
            print(colValue)
            _temp.push(new Node(col * row, PATH_NODE, col, row))
        }
        nodeCollection.push(_temp)
    }
    //make childs
    let sizeM = nodeCollection.length
    for (let row = 0; row < sizeM; row++) {
        let sizeS = nodeCollection[row].length
        for (let col = 0; col < sizeS; col++) {
            for (let dir of direcs) {
                if (col + dir[0] >= 0 && col + dir[0] < sizeS 
                    && row + dir[1] >= 0 && row + dir[1] < sizeM) {
                    if (nodeCollection[row + dir[1]][col + dir[0]].childs.length == 0 &&
                        !nodeCollection[row + dir[1]][col + dir[0]].owned) {
                        nodeCollection[row + dir[1]][col + dir[0]].owned = true
                        nodeCollection[row][col].childs.push(nodeCollection[row + dir[1]][col + dir[0]])
                    }
                }
            }
        }
    }
    graphDim = [cols, rows]
    let root = nodeCollection[0][0]
    root.type = ROOT_NODE
    GRID = generateGrid(canvas, context, graphDim[0], graphDim[1])
    bFs(root)
}

