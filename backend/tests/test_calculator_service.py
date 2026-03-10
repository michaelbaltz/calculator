"""Unit tests for CalculatorService."""

import pytest

from app.services.calculator import CalculatorService


@pytest.fixture(name="service")
def fixture_service() -> CalculatorService:
    """Return a fresh CalculatorService instance for each test."""
    return CalculatorService()


class TestAdd:
    """Tests for the addition operator."""

    def test_add_positive_integers(self, service: CalculatorService) -> None:
        assert service.calculate(2, 3, "+") == 5

    def test_add_negative_operands(self, service: CalculatorService) -> None:
        assert service.calculate(-4, -6, "+") == -10

    def test_add_float_operands(self, service: CalculatorService) -> None:
        assert service.calculate(1.5, 2.5, "+") == pytest.approx(4.0)


class TestSubtract:
    """Tests for the subtraction operator."""

    def test_subtract_positive_integers(self, service: CalculatorService) -> None:
        assert service.calculate(10, 4, "-") == 6

    def test_subtract_negative_operands(self, service: CalculatorService) -> None:
        assert service.calculate(-3, -2, "-") == -1

    def test_subtract_float_operands(self, service: CalculatorService) -> None:
        assert service.calculate(5.5, 2.2, "-") == pytest.approx(3.3)


class TestMultiply:
    """Tests for the multiplication operator."""

    def test_multiply_positive_integers(self, service: CalculatorService) -> None:
        assert service.calculate(3, 4, "*") == 12

    def test_multiply_negative_operands(self, service: CalculatorService) -> None:
        assert service.calculate(-3, 4, "*") == -12

    def test_multiply_by_zero(self, service: CalculatorService) -> None:
        assert service.calculate(99, 0, "*") == 0

    def test_multiply_float_operands(self, service: CalculatorService) -> None:
        assert service.calculate(2.5, 4.0, "*") == pytest.approx(10.0)


class TestDivide:
    """Tests for the division operator."""

    def test_divide_positive_integers(self, service: CalculatorService) -> None:
        assert service.calculate(10, 2, "/") == 5.0

    def test_divide_float_operands(self, service: CalculatorService) -> None:
        assert service.calculate(7.0, 2.0, "/") == pytest.approx(3.5)

    def test_divide_negative_operands(self, service: CalculatorService) -> None:
        assert service.calculate(-9, 3, "/") == -3.0

    def test_divide_by_zero_raises_value_error(self, service: CalculatorService) -> None:
        with pytest.raises(ValueError, match="Division by zero"):
            service.calculate(5, 0, "/")


class TestUnknownOperator:
    """Tests for unsupported operator strings."""

    def test_unknown_operator_raises_value_error(self, service: CalculatorService) -> None:
        with pytest.raises(ValueError, match="Unknown operator: %"):
            service.calculate(1, 2, "%")

    def test_empty_operator_raises_value_error(self, service: CalculatorService) -> None:
        with pytest.raises(ValueError, match="Unknown operator:"):
            service.calculate(1, 2, "")
