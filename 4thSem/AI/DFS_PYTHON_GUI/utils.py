import pygame
from enum import Enum
from typing import Sequence
from pygame import (
    draw as pgDraw,
)


class Colors:
    BLACK = [0, 0, 0]


class Window:
    def __init__(self, width: int = 400, height: int = 400, caption: str = "this is window") -> None:
        pygame.init()
        pygame.font.init()
        pygame.display.set_caption(caption)
        self.width: int = width
        self.height: int = height
        self.header_size: int = 100
        self.screen: pygame.Surface = pygame.display.set_mode([width, height], pygame.RESIZABLE)

    def load_font(self, font_name: str = "Comic Sans MS") -> None:
        self.font = pygame.font.SysFont(font_name, 30)

    def header(self, text: str, header_size: int = 100) -> None:
        self.header_size = header_size
        pgDraw.line(self.screen, (255, 0, 0), (0, 0), (self.width, 0), self.header_size)
        textsurface = self.font.render(text, True, Colors.BLACK)
        (f_w, f_h) = textsurface.get_size()
        self.screen.blit(textsurface, (self.width // 2 - (f_w // 2), (self.header_size // 2) - (f_h * 1.5)))

    def update(self):
        self.width, self.height = self.screen.get_size()
        self.header_size = int(self.height * 0.1)  # 10%


class BoundingBox:
    def __init__(self, start_pos: Sequence[int], end_pos: Sequence[int], width: int, height: int) -> None:
        self.start_pos = start_pos
        self.end_pos = end_pos
        self.width = width
        self.height = height

    def is_inside(self, x: int, y: int) -> bool:
        return x >= self.start_pos[0] and x <= self.end_pos[0] and y >= self.start_pos[1] and y <= self.end_pos[1]

    def index_of(self, x: int, y: int) -> tuple[int, int]:
        if not self.is_inside(x, y):
            return -1, -1
        return (x - self.start_pos[0]) // self.width, (y - self.start_pos[1]) // self.height

    def pos_from_index(self, x_indx: int, y_indx: int) -> list[int]:
        return [
            self.start_pos[0] + (self.width * x_indx),
            self.start_pos[1] + (self.height * y_indx),
        ]




def create_maze_from_file(window, grid, board:BoundingBox):
    rows = len(grid)
    columns = len(grid[0])
    file = open("c.txt","w")
    for i in range(rows):
        for j in range(columns):
            x1 = j * board.width
            y1 = i * board.height
            x2 = (j + 1) * board.width
            y2 = (i + 1) * board.height
            file.write(f"{x1,y1,x2,y2}\n")
            pgDraw.rect(
                    window.screen,
                    grid[i][j].color,
                    [x1,y1,x2,y2],
                )
    pygame.display.update()
    file.close()
