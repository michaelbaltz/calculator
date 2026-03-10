"""Router exposing the /calculus endpoint for symbolic calculus operations."""

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.models.calculation import CalculusRequest, CalculusResponse, ErrorResponse
from app.services.calculus import CalculusService

router = APIRouter()
_service = CalculusService()


@router.post(
    "/calculus",
    response_model=CalculusResponse,
    responses={400: {"model": ErrorResponse}},
)
def calculus(request: CalculusRequest) -> CalculusResponse:
    """Perform a symbolic calculus operation.

    Args:
        request: A CalculusRequest containing the operation, expression, variable,
            and optional bounds for definite integrals.

    Returns:
        A CalculusResponse with the symbolic or numeric result.

    Raises:
        JSONResponse: 400 if the service raises a ValueError (e.g. invalid expression
            or missing bounds).
    """
    try:
        result = _service.compute(
            request.operation,
            request.expression,
            request.variable,
            request.lower,
            request.upper,
        )
    except ValueError as exc:
        error_body = ErrorResponse(error="Calculation error", detail=str(exc))
        return JSONResponse(status_code=400, content=error_body.model_dump())

    return CalculusResponse(
        result=result,
        operation=request.operation,
        expression=request.expression,
        variable=request.variable,
        lower=request.lower,
        upper=request.upper,
    )
