from typing import List, Literal, Union

from pydantic import BaseModel, Field


class ShapeBase(BaseModel):
    id: str = Field(..., description="Unique identifier for the shape")
    color: str = Field("#000000", description="Hex color or CSS color name")
    stroke_width: int = Field(2, ge=0)


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


class Path(ShapeBase):
    type: Literal["path"] = "path"
    d: str = Field(..., description="SVG path data string (e.g., 'M 10 10 L 50 50')")


class Canvas(BaseModel):
    width: int = 500
    height: int = 500
    shapes: List[Union[Circle, Rectangle, Path]]
