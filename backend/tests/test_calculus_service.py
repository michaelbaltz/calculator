"""Unit tests for the CalculusService."""

import pytest

from app.services.calculus import CalculusService


@pytest.fixture(name="service")
def fixture_service() -> CalculusService:
    """Return a fresh CalculusService instance."""
    return CalculusService()


class TestDerivative:
    """Tests for CalculusService.derivative."""

    def test_derivative_polynomial(self, service: CalculusService) -> None:
        result = service.derivative("x**2 + 3*x", "x")
        assert result == "2*x + 3"

    def test_derivative_trig(self, service: CalculusService) -> None:
        result = service.derivative("sin(x)", "x")
        assert result == "cos(x)"

    def test_derivative_exponential(self, service: CalculusService) -> None:
        result = service.derivative("exp(x)", "x")
        assert result == "exp(x)"

    def test_derivative_constant(self, service: CalculusService) -> None:
        result = service.derivative("5", "x")
        assert result == "0"


class TestIntegral:
    """Tests for CalculusService.integral."""

    def test_integral_polynomial(self, service: CalculusService) -> None:
        result = service.integral("x**2", "x")
        assert result == "x**3/3"

    def test_integral_trig(self, service: CalculusService) -> None:
        result = service.integral("cos(x)", "x")
        assert result == "sin(x)"

    def test_integral_constant(self, service: CalculusService) -> None:
        result = service.integral("3", "x")
        assert result == "3*x"


class TestDefiniteIntegral:
    """Tests for CalculusService.definite_integral."""

    def test_definite_integral_polynomial(self, service: CalculusService) -> None:
        result = service.definite_integral("x**2", "x", 0.0, 3.0)
        assert float(result) == pytest.approx(9.0)

    def test_definite_integral_trig(self, service: CalculusService) -> None:
        import math
        result = service.definite_integral("cos(x)", "x", 0.0, math.pi / 2)
        assert float(result) == pytest.approx(1.0)

    def test_definite_integral_linear(self, service: CalculusService) -> None:
        # integral of x from 0 to 2 = 2
        result = service.definite_integral("x", "x", 0.0, 2.0)
        assert float(result) == pytest.approx(2.0)


class TestComputeDispatch:
    """Tests for CalculusService.compute dispatcher."""

    def test_compute_derivative(self, service: CalculusService) -> None:
        result = service.compute("derivative", "x**3", "x")
        assert result == "3*x**2"

    def test_compute_integral(self, service: CalculusService) -> None:
        result = service.compute("integral", "x", "x")
        assert result == "x**2/2"

    def test_compute_definite_integral(self, service: CalculusService) -> None:
        result = service.compute("definite_integral", "x**2", "x", lower=0.0, upper=3.0)
        assert float(result) == pytest.approx(9.0)

    def test_compute_unknown_operation_raises(self, service: CalculusService) -> None:
        with pytest.raises(ValueError, match="Unknown operation: laplace"):
            service.compute("laplace", "x", "x")

    def test_compute_missing_bounds_raises(self, service: CalculusService) -> None:
        with pytest.raises(
            ValueError,
            match="lower and upper bounds are required for definite_integral",
        ):
            service.compute("definite_integral", "x**2", "x")

    def test_compute_missing_upper_bound_raises(self, service: CalculusService) -> None:
        with pytest.raises(
            ValueError,
            match="lower and upper bounds are required for definite_integral",
        ):
            service.compute("definite_integral", "x**2", "x", lower=0.0)


class TestInvalidExpression:
    """Tests for invalid expression handling."""

    def test_derivative_invalid_expression_raises(
        self, service: CalculusService
    ) -> None:
        with pytest.raises(ValueError, match="Invalid expression"):
            service.derivative("x +* 3", "x")

    def test_integral_invalid_expression_raises(
        self, service: CalculusService
    ) -> None:
        with pytest.raises(ValueError, match="Invalid expression"):
            service.integral("x +* 3", "x")

    def test_definite_integral_invalid_expression_raises(
        self, service: CalculusService
    ) -> None:
        with pytest.raises(ValueError, match="Invalid expression"):
            service.definite_integral("x +* 3", "x", 0.0, 1.0)
