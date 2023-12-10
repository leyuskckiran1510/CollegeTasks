from sys import argv
from time import sleep

"""
| is a vertical pipe connecting north and south.
- is a horizontal pipe connecting east and west.
L is a 90-degree bend connecting north and east.
J is a 90-degree bend connecting north and west.
7 is a 90-degree bend connecting south and west.
F is a 90-degree bend connecting south and east.
. is ground; there is no pipe in this tile.
S is the starting position of the animal; there is 
    a pipe on this tile, but your sketch doesn't show what shape the pipe has.
//mapping for better visulization
"""

pipes = {
    "|": "│",
    "-": "─",
    "L": "└",
    "J": "┘",
    "7": "┐",
    "F": "┌",
    ".": ".",
    "S": "S",
}
NON_PIPE = 0
PIPE = 1
IS_DFS = 1


class Node:
    def __init__(self, value, ix, iy) -> None:
        self.value = value
        self.ix = ix
        self.iy = iy
        self.parent = None
        self.depth = 0
        self.visited = False
        self.childs: list[Node] = []
        self.dirct = self.calc_direct()
        self.color = [255 * i for i in self.dirct]
        self.type = any(self.dirct)

    def calc_direct(self):
        tblr = [0, 0, 0, 0]
        if self.value == "|":
            tblr = [1, 1, 0, 0]
        elif self.value == "-":
            tblr = [0, 0, 1, 1]
        elif self.value == "L":
            tblr = [1, 0, 0, 1]
        elif self.value == "J":
            tblr = [1, 0, 1, 0]
        elif self.value == "7":
            tblr = [0, 1, 1, 0]
        elif self.value == "F":
            tblr = [0, 1, 0, 1]
        elif self.value == "S":
            tblr = [1, 1, 1, 1]

        return tblr

    def connects(self, other: "Node"):
        _cont = False
        if self.ix == other.ix:
            if self.iy < other.iy:
                _cont = self.dirct[1] & other.dirct[0]
            else:
                _cont = self.dirct[0] & other.dirct[1]
        else:
            if self.ix < other.ix:
                _cont = self.dirct[3] & other.dirct[2]
            else:
                _cont = self.dirct[2] & other.dirct[3]
        return _cont

    def __repr__(self) -> str:
        return f"{self.value}({self.ix,self.iy})"


directions = [
    [0, 1],
    [0, -1],
    [-1, 0],
    [1, 0],
]


def make_path(matrix: list[list[Node]], root_node: Node):
    queue = [root_node]
    max_depth = 0

    while queue:
        cur_node = queue.pop(-IS_DFS)
        cur_node.visited = True
        sleep(0.1)
        for dx, dy in directions:
            x = cur_node.ix + dx
            y = cur_node.iy + dy
            if (
                y >= 0
                and y < len(matrix)
                and x >= 0
                and x < len(matrix[y])
                and matrix[y][x].value not in ". "
                and matrix[y][x].connects(cur_node)
                and not matrix[y][x].visited
            ):
                matrix[y][x].parent = cur_node
                matrix[y][x].color = cur_node.color
                matrix[y][x].depth = cur_node.depth + 1
                if matrix[y][x].depth > max_depth:
                    max_depth = matrix[y][x].depth
                if dx | dy:
                    cur_node.childs.append(matrix[y][x])
        display_matrix(matrix=matrix)
        queue.extend(cur_node.childs)
    return max_depth


def display_matrix(matrix: list[list[Node]]):
    print("\x1b[2J\x1b[0;0H", end="")
    for rvalue in matrix:
        for cvalue in rvalue:
            v = pipes.get(cvalue.value, cvalue)
            color = "\x1b[38;2;{};{};{};{}m".format(*cvalue.color)
            if cvalue.visited:
                print(f"{color}{v}\x1b[m", end="")
            else:
                v = "0"
                print(f"\x1b[38;2;255;100;100m{v}\x1b[m", end="")
        print("")


def write_img(matrix: list[list[Node]]):
    with open("answer.txt", "w") as fp:
        for rvalue in matrix:
            _line = ""
            for cvalue in rvalue:
                v = "0"
                if cvalue.visited:
                    v = pipes.get(cvalue.value, cvalue.value)

                _line += v
            fp.write(f"{_line}\n")


def main():
    global IS_DFS
    IS_DFS = 0 if input("Do You Want BFS?(y/N)").lower() == "y" else 1
    matrix: list[list[Node]] = []
    root_node: Node | None = None
    ans = 0
    with open(argv[1], "r") as fp:
        for row, i in enumerate(fp.readlines()):
            _temp = []
            for col, v in enumerate(i.strip()):
                _node = Node(v, col, row)
                if v == "S":
                    root_node = _node
                _temp.append(_node)
            matrix.append(_temp)
    if root_node:
        ans = make_path(matrix, root_node)
    display_matrix(matrix)
    write_img(matrix=matrix)
    print(ans)


if __name__ == "__main__":
    if len(argv) < 2:
        print("Provide A input File")
    else:
        main()
