from typing import Annotated, List, Literal, Union

from pydantic import BaseModel, Field


class ShapeBase(BaseModel):
    id: str = Field(..., description="Unique identifier for the shape")
    color: str = Field("#000000", description="Hex color or CSS color name")
    stroke_width: int = Field(2, ge=0)
    opacity: float = Field(1.0, ge=0, le=1)


class Circle(ShapeBase):
    type: Literal["circle"] = "circle"
    cx: float
    cy: float
    r: float


class Rectangle(ShapeBase):
    type: Literal["rectangle"] = "rectangle"
    x: float
    y: float
    width: float
    height: float
    rx: float = 0.0  # for rounded corners


class Path(ShapeBase):
    type: Literal["path"] = "path"
    d: str = Field(..., description="SVG path data string (e.g., 'M 10 10 L 50 50')")


class Line(ShapeBase):
    type: Literal["line"] = "line"
    x1: float
    y1: float
    x2: float
    y2: float
    stroke_width: float = 2.0


ShapeUnion = Annotated[
    Union[Circle, Rectangle, Path, Line], Field(discriminator="type")
]


class Canvas(BaseModel):
    width: float = 500.0
    height: float = 500.0
    shapes: List[ShapeUnion]
