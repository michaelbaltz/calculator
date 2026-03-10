"""Pydantic models for calculator request and response payloads."""

from typing import Literal, Optional

from pydantic import BaseModel


class CalculationRequest(BaseModel):
    """Request model for a binary arithmetic calculation."""

    operand_a: float
    operand_b: float
    operator: Literal["+", "-", "*", "/"]


class CalculationResponse(BaseModel):
    """Response model containing the calculation result and context."""

    result: float
    operand_a: float
    operand_b: float
    operator: str
    expression: str


class ErrorResponse(BaseModel):
    """Response model for error conditions."""

    error: str
    detail: str


class ScientificRequest(BaseModel):
    """Request model for a scientific calculation."""

    operation: Literal["factorial", "log", "log10", "exp", "power", "log_base"]
    operand: float
    operand_b: Optional[float] = None  # used for power(x, y) and log_base(x, base)


class ScientificResponse(BaseModel):
    """Response model containing the scientific calculation result and context."""

    result: float
    operation: str
    operand: float
    operand_b: Optional[float]
    expression: str  # e.g. "log(10)" or "2 ^ 3" or "5!"
