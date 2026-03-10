"""Router exposing the /scientific endpoint."""

from typing import Optional

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.models.calculation import ErrorResponse, ScientificRequest, ScientificResponse
from app.services.calculator import ScientificCalculatorService

router = APIRouter()
_service = ScientificCalculatorService()


def _build_expression(operation: str, operand: float, operand_b: Optional[float]) -> str:
    """Construct a human-readable expression string for the operation.

    Args:
        operation: The scientific operation name.
        operand: The primary operand.
        operand_b: The optional secondary operand.

    Returns:
        A string such as "5!", "log(10)", "2 ^ 3", or "log_2(8)".
    """
    if operation == "factorial":
        return f"{operand}!"
    if operation == "log":
        return f"log({operand})"
    if operation == "log10":
        return f"log10({operand})"
    if operation == "exp":
        return f"exp({operand})"
    if operation == "power":
        return f"{operand} ^ {operand_b}"
    if operation == "log_base":
        return f"log_{operand_b}({operand})"
    return f"{operation}({operand})"


@router.post(
    "/scientific",
    response_model=ScientificResponse,
    responses={400: {"model": ErrorResponse}},
)
def scientific(request: ScientificRequest) -> ScientificResponse:
    """Perform a scientific calculation.

    Args:
        request: A ScientificRequest containing the operation name and operands.

    Returns:
        A ScientificResponse with the result and a human-readable expression.

    Raises:
        HTTPException: 400 if the service raises a ValueError (e.g. negative factorial).
    """
    try:
        result = _service.compute(request.operation, request.operand, request.operand_b)
    except ValueError as exc:
        error_body = ErrorResponse(error="Calculation error", detail=str(exc))
        return JSONResponse(status_code=400, content=error_body.model_dump())

    expression = _build_expression(request.operation, request.operand, request.operand_b)
    return ScientificResponse(
        result=result,
        operation=request.operation,
        operand=request.operand,
        operand_b=request.operand_b,
        expression=expression,
    )
