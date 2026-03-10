"""Router exposing the /calculate endpoint."""

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.models.calculation import CalculationRequest, CalculationResponse, ErrorResponse
from app.services.calculator import CalculatorService

router = APIRouter()
_service = CalculatorService()


@router.post(
    "/calculate",
    response_model=CalculationResponse,
    responses={400: {"model": ErrorResponse}},
)
def calculate(request: CalculationRequest) -> CalculationResponse:
    """Perform a binary arithmetic calculation.

    Args:
        request: A CalculationRequest containing operands and an operator.

    Returns:
        A CalculationResponse with the result and a human-readable expression.

    Raises:
        HTTPException: 400 if the service raises a ValueError (e.g. division by zero).
    """
    try:
        result = _service.calculate(request.operand_a, request.operand_b, request.operator)
    except ValueError as exc:
        error_body = ErrorResponse(error="Calculation error", detail=str(exc))
        return JSONResponse(status_code=400, content=error_body.model_dump())

    expression = f"{request.operand_a} {request.operator} {request.operand_b}"
    return CalculationResponse(
        result=result,
        operand_a=request.operand_a,
        operand_b=request.operand_b,
        operator=request.operator,
        expression=expression,
    )
