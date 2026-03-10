"""Pydantic models for calculator request and response payloads."""

from typing import Literal

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
