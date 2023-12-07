// Types
const ROOT_NODE = 0
const SRC_NODE = 0
const PATH_NODE = 1
const FINAL_NODE = 3
const WALL_NODE = 2
const print = console.log
var nodeCollection = new Array()
var LAST_USED = false
var old_nodeCollection = new Array()
var rootNode = null
var COLORS = ["red", "green", "yellow", "blue"]
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
        this.parent = null
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
    if (LAST_USED) {
        LAST_USED = false
        nodeCollection = JSON.parse(JSON.stringify(old_nodeCollection))
    } else {
        rootNode = null
        let destination = null
        for (let row = 0; row < rows; row++) {
            let _temp = []
            for (let col = 0; col < cols; col++) {
                let [px, py] = GRID.pos_from_index(col, row)
                let _colValue = context.getImageData(px + GRID.width / 2, py + GRID.height / 2, 1, 1).data
                if (_colValue[0] >= 200 && _colValue[1] >= 200 && _colValue[2] <= 100) {
                    _temp.push(new Node(col * row, WALL_NODE, col, row))
                } else if (_colValue[0] >= 200 &&
                    _colValue[1] <= 100 &&
                    _colValue[2] <= 100 &&
                    rootNode == null) {
                    let _rt = new Node(col * row, ROOT_NODE, col, row)
                    rootNode = _rt;
                    _temp.push(rootNode)
                } else if (_colValue[0] <= 100 &&
                    _colValue[1] <= 100 &&
                    _colValue[2] >= 200 &&
                    destination == null) {
                    destination = [col, row];
                    _temp.push(new Node(col * row, FINAL_NODE, col, row))

                }
                else {
                    _temp.push(new Node(col * row, PATH_NODE, col, row))

                }
            }
            nodeCollection.push(_temp)
        }
        old_nodeCollection = JSON.parse(JSON.stringify(nodeCollection))
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
                nodeCollection[y][x].parent == null
                
            ) {
                if (nodeCollection[y][x].type == WALL_NODE) {
                    colorCellByIndex(canvas, context, nodeCollection[y][x].ix, nodeCollection[y][x].iy, COLORS[nodeCollection[y][x].type])
                } else {
                    nodeCollection[y][x].parent = child
                    child.childs.push(nodeCollection[y][x])
                    if (nodeCollection[y][x].type == ROOT_NODE || nodeCollection[y][x].type == FINAL_NODE) {
                        colorCellByIndex(canvas, context, nodeCollection[y][x].ix, nodeCollection[y][x].iy, COLORS[nodeCollection[y][x].type])
                    }
                    if (BFS) {
                        childs.push(nodeCollection[y][x])
                    } else {
                        // childs.push(nodeCollection[y][x])
                        make_child(nodeCollection[y][x])
                    }
                }
                
            }
        }
    }

}

let travelBack = (node) => {
    let parent = node.parent;
    while (parent.type != ROOT_NODE) {
        let _temp = parent;
        let id = setTimeout(() => {
            colorCellByIndex(canvas, context, _temp.ix, _temp.iy, "purple")
        }, SPEED)
        timeOuts.push(id)
        parent = parent.parent;
    }
}

let bFs = (...root_node) => {
    let my_slice = [...root_node]
    let childs = []
    if (my_slice.length == 0) {
        return
    }
    while (my_slice.length > 0) {
        let _childs = my_slice[0].childs
        childs.push(..._childs)
        let visted = my_slice.splice(0, 1)[0]

        if (_childs.length > 0) {
            colorCellByIndex(canvas, context, visted.ix, visted.iy, COLORS[visted.type])
        } else {
            colorCellByIndex(canvas, context, visted.ix, visted.iy, "grey")
        }
        visted.traversed = true
        if (visted.type == FINAL_NODE) {
            for (let _m of timeOuts) {
                clearTimeout(_m)
            }
            travelBack(visted)
            return
        }

    }
    let id = setTimeout(() => {
        bFs(...childs)
    }, SPEED)
    timeOuts.push(id)
}

let dFs = (root_node) => {
    for (let x of root_node.childs) {
        if (!x.traversed) {
            x.traversed = true
            let id = setTimeout(() => {
                // print("running DFS",x)
                let _has_child = 0
                if (x.childs.length > 0) {
                    colorCellByIndex(canvas, context, x.ix, x.iy, COLORS[x.type])
                    _has_child = 1
                } else {
                    colorCellByIndex(canvas, context, x.ix, x.iy, "grey")
                }
                if (x.type == FINAL_NODE) {
                    for (let _m of timeOuts) {
                        clearTimeout(_m)
                    }
                    travelBack(x)
                    return
                }
                if (_has_child) {
                    dFs(x)
                }
            }, SPEED)
            timeOuts.push(id)
        }
    }
}

let run = (_root) => {
    // bFs(_root)
    if (BFS) {
        bFs(_root)
    } else {        
        // bFs(_root)
        dFs(_root)
    }
}
