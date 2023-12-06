// Types
const ROOT_NODE = 0
const SRC_NODE = 0
const PATH_NODE = 1
const FINAL_NODE = 2
const WALL_NODE = 2
const print = console.log
var nodeCollection = new Array()
var rootNode = null
var COLORS = ["red", "green", "blue", "pink"]
var timeOuts = []
var BFS = 1

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

let sleep = (x) => {
    var now = new Date().getTime();
    while (new Date().getTime() < now + x) { /* Do nothing */ }
}



let direcs = [
    // front ->middle/top/down
    [1, 0],
    // [1, -1],
    // [1, 1],
    
    // back ->middle/top/down
    [-1, 0],
    // [-1, -1],
    // [-1, 1],

    // center ->middle/top/down
    [0, 1],
    [0, -1],
]

let createNodes = (rows, cols) => {
    nodeCollection = new Array()
    //create Nodes
    print("Making Nodes")
    rootNode = null
    for (let row = 0; row < rows; row++) {
        let _temp = []
        for (let col = 0; col < cols; col++) {
            let [px, py] = GRID.pos_from_index(col, row)
            let _colValue = context.getImageData(px+GRID.width/2, py+GRID.height/2, 1, 1).data
            if (_colValue[0] >= 200 && _colValue[1] >= 200 && _colValue[2] <= 100) {
                _temp.push(new Node(col * row, WALL_NODE, col, row))
            } else if (_colValue[0] >= 200 && _colValue[1] <= 100 && _colValue[2] <= 100 && rootNode == null) {
                let _rt = new Node(col * row, ROOT_NODE, col, row)
                rootNode = _rt;
                print("FoundRoot")
                _temp.push(rootNode)
            }
            else {
                _temp.push(new Node(col * row, PATH_NODE, col, row))

            }
        }
        nodeCollection.push(_temp)
    }

    make_child(rootNode)

    graphDim = [cols, rows]
    GRID = generateGrid(canvas, context, graphDim[0], graphDim[1])   
}

let make_child = (root) => {
    let childs = [root]
    for (let child of childs) {
        for (dir of direcs) {
            let [x, y] = [child.ix + dir[0], child.iy + dir[1]]
            if (
                x >= 0 && 
                x < nodeCollection[0].length && 
                y >= 0 && 
                y < nodeCollection.length &&
                !nodeCollection[y][x].owned &&
                nodeCollection[y][x].type != WALL_NODE
            ) {
                nodeCollection[y][x].owned = true
                child.childs.push(nodeCollection[y][x])
                if(BFS){
                    childs.push(nodeCollection[y][x])
                }else{
                    make_child(nodeCollection[y][x])

                }
            }
        }
    }

}

let bFs = (...root_node) => {
    let my_slice = [...root_node]
    let childs = []
    if (my_slice.length == 0) {
        return
    }
    while (my_slice.length > 0) {
        childs.push(...my_slice[0].childs)
        let visted = my_slice.splice(0, 1)[0]
        colorCellByIndex(canvas, context, visted.ix, visted.iy, COLORS[visted.type])
        visted.traversed = true

    }
    let id = setTimeout(() => {
        bFs(...childs)
    }, SPEED)
    timeOuts.push(id)
}
