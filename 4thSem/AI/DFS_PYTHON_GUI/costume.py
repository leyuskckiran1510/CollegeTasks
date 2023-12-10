import enum
import re
import time
import pygame
from typing import Union
from pygame import (
    draw as pgDraw,
    mouse as pgMouse,
)

from utils import (  # type:ignore
    Window,
    BoundingBox,
    create_maze_from_file,
)

BLACK = [0, 0, 0]


class Node:
    def __init__(self, ix, iy, value) -> None:
        self.ix = ix
        self.iy = iy
        self.value = value
        self.type = self.calc_type()
        self.parent = None
        self.visited = False
        self.childs: list[Node] | None = []

    def calc_type(self):
        if self.value == "A":
            return 0
        elif self.value == "B":
            return 1
        elif self.value == "*":
            return 2
        else:
            return 3

    def __repr__(self) -> str:
        return f"{self.value} = > {self.childs}"

    @property
    def color(self):
        _color = [0, 0, 0]
        if self.value == "*":
            _color = [0, 0, 0]
        elif self.value == "A":
            _color = [255, 0, 0]
        elif self.value == "B":
            _color = [0, 255, 0]
        else:
            _color = [255] * 3
        return _color


def itr_add(self: Union[list[int], tuple[int]], other: Union[list[int], tuple[int]]) -> Union[list[int], tuple[int]]:
    new: Union[list[int], tuple[int]] = []
    if len(self) < len(other):
        return self
    if len(other) == 1:
        new = [i + other[0] for i in self]
    else:
        new = [i + j for i, j in zip(self, other)]
    return new


def chart(grid: list[list[Node]], window: Window, cols=3, rows: int = 3) -> BoundingBox:
    start_pos = int(0), window.header_size
    end_pos = window.width, window.height
    width = (end_pos[0] - start_pos[0]) // cols
    height = (end_pos[1] - start_pos[1]) // rows
    return BoundingBox(start_pos, end_pos, width, height)


def find_root(grid):
    _root, _des = [None, None]
    for i in grid:
        for x in i:
            if x.value == "A":
                _root = x
            elif x.value == "B":
                _des = x
    return [_root, _des]


FPS: int = 60
COMPLETED = False
board: BoundingBox = BoundingBox((0, 0), (0, 0), 0, 0)
RUN = True

with open("maze.txt", "r") as f:
    contents = f.read()

maze_contents = [line.strip() for line in contents.split("\n")]
GRID = [[Node(col, row, i) for col, i in enumerate(x)] for row, x in enumerate(maze_contents)]
padding = 10
cell_size = 60
WINDOW = Window(
    width=len(maze_contents[0]) * cell_size + padding,
    height=len(maze_contents) * cell_size + padding,
    caption="TicTacToe",
)
WINDOW.header_size = 0
WINDOW.load_font()
ROOT_NODE, DESTI_NODE = find_root(GRID)


def back_track(node: Node | None):
    if node == None or node.parent == None:
        return
    x1 = node.ix * board.width
    y1 = node.iy * board.width
    pgDraw.rect(
        WINDOW.screen,
        [200, 200, 0],
        [x1, y1 + 3, board.width, board.height],
    )
    pygame.display.update()
    time.sleep(0.1)
    return back_track(node.parent)


FOUND = False


def dfs(node: Node | None):
    global FOUND
    if not node or not node.childs:
        return
    if FOUND:
        return
    for item in node.childs:
        (x1, y1) = board.pos_from_index(item.ix, item.iy)
        pgDraw.rect(
            WINDOW.screen,
            [200, 200, 150],
            [x1, y1, board.width, board.height],
        )
        pygame.display.update()
        if item.value == "B":
            FOUND = True
            back_track(item)
            print("FOUND DESTINATION")
            return

        item.visited = True
        if not FOUND:
            time.sleep(0.1)
            dfs(item)


def handel_mouse_click():
    ...


def begin_animation():
    dfs(ROOT_NODE)


def make_node(root: Node | None):
    if not root:
        return None
    directions = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
    ]
    for _dy, _dx in directions:
        x = root.ix + _dx
        y = root.iy + _dy
        if (
            y >= 0
            and y < len(GRID)
            and x >= 0
            and x < len(GRID[y])
            and GRID[y][x].parent == None
            and len(GRID[y][x].childs) == 0
            and GRID[y][x].value != "*"
        ):
            if not root.childs:
                root.childs = []
            GRID[y][x].parent = root
            root.childs.append(GRID[y][x])
    if not root.childs:
        return
    for child in root.childs:
        make_node(child)


make_node(ROOT_NODE)
COUNT = 0
RE_DRAW = False
FFF_LOP = False
while RUN == True:
    if not RE_DRAW:
        RE_DRAW = False
        WINDOW.screen.fill([255, 255, 255])
        board = chart(GRID, WINDOW, len(GRID[0]), len(GRID))
        create_maze_from_file(WINDOW, GRID, board)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            RUN = False
            print("quit")
        elif event.type == pygame.KEYDOWN and (event.dict.get("unicode", "").lower() == "q"):
            RUN = False
        elif event.type == pygame.KEYDOWN and (event.dict.get("unicode", "") == " "):
            COUNT += 1
            FFF_LOP = True
            GRID = [[Node(col, row, i) for col, i in enumerate(x)] for row, x in enumerate(maze_contents)]
            ROOT_NODE, DESTI_NODE = find_root(GRID)
            make_node(ROOT_NODE)
            begin_animation()
            FOUND = False
            RE_DRAW = True

        elif FFF_LOP and event.type == pygame.KEYDOWN and (event.dict.get("unicode", "") == "k"):
            FFF_LOP = False
            RE_DRAW = False
        elif event.type == pygame.KEYDOWN and (event.dict.get("unicode", "") == "r"):
            pass
        elif event.type == pygame.MOUSEBUTTONDOWN:
            handel_mouse_click()
        elif event.type == pygame.WINDOWRESIZED:
            WINDOW.update()

    pygame.display.update()
    time.sleep(1 / FPS)
