"""Unit tests for ScientificCalculatorService."""

import math

import pytest

from app.services.calculator import ScientificCalculatorService


@pytest.fixture(name="service")
def fixture_service() -> ScientificCalculatorService:
    """Return a fresh ScientificCalculatorService instance for each test."""
    return ScientificCalculatorService()


class TestFactorial:
    """Tests for the factorial operation."""

    def test_factorial_zero(self, service: ScientificCalculatorService) -> None:
        assert service.factorial(0) == 1.0

    def test_factorial_one(self, service: ScientificCalculatorService) -> None:
        assert service.factorial(1) == 1.0

    def test_factorial_positive_integer(self, service: ScientificCalculatorService) -> None:
        assert service.factorial(5) == 120.0

    def test_factorial_float_integer_value(self, service: ScientificCalculatorService) -> None:
        """A float that represents a whole number should be accepted."""
        assert service.factorial(6.0) == 720.0

    def test_factorial_negative_raises_value_error(
        self, service: ScientificCalculatorService
    ) -> None:
        with pytest.raises(ValueError, match="negative"):
            service.factorial(-1)

    def test_factorial_non_integer_raises_value_error(
        self, service: ScientificCalculatorService
    ) -> None:
        with pytest.raises(ValueError, match="non-negative integer"):
            service.factorial(2.5)


class TestLog:
    """Tests for the natural logarithm operation."""

    def test_log_of_one(self, service: ScientificCalculatorService) -> None:
        assert service.log(1) == pytest.approx(0.0)

    def test_log_of_e(self, service: ScientificCalculatorService) -> None:
        assert service.log(math.e) == pytest.approx(1.0)

    def test_log_of_positive_value(self, service: ScientificCalculatorService) -> None:
        assert service.log(10) == pytest.approx(math.log(10))

    def test_log_zero_raises_value_error(self, service: ScientificCalculatorService) -> None:
        with pytest.raises(ValueError, match="positive"):
            service.log(0)

    def test_log_negative_raises_value_error(self, service: ScientificCalculatorService) -> None:
        with pytest.raises(ValueError, match="positive"):
            service.log(-5)


class TestLog10:
    """Tests for the base-10 logarithm operation."""

    def test_log10_of_one(self, service: ScientificCalculatorService) -> None:
        assert service.log10(1) == pytest.approx(0.0)

    def test_log10_of_ten(self, service: ScientificCalculatorService) -> None:
        assert service.log10(10) == pytest.approx(1.0)

    def test_log10_of_hundred(self, service: ScientificCalculatorService) -> None:
        assert service.log10(100) == pytest.approx(2.0)

    def test_log10_zero_raises_value_error(self, service: ScientificCalculatorService) -> None:
        with pytest.raises(ValueError, match="positive"):
            service.log10(0)

    def test_log10_negative_raises_value_error(
        self, service: ScientificCalculatorService
    ) -> None:
        with pytest.raises(ValueError, match="positive"):
            service.log10(-1)


class TestLogBase:
    """Tests for the arbitrary-base logarithm operation."""

    def test_log_base_2_of_8(self, service: ScientificCalculatorService) -> None:
        assert service.log_base(8, 2) == pytest.approx(3.0)

    def test_log_base_10_of_1000(self, service: ScientificCalculatorService) -> None:
        assert service.log_base(1000, 10) == pytest.approx(3.0)

    def test_log_base_x_zero_raises_value_error(
        self, service: ScientificCalculatorService
    ) -> None:
        with pytest.raises(ValueError, match="positive x"):
            service.log_base(0, 2)

    def test_log_base_x_negative_raises_value_error(
        self, service: ScientificCalculatorService
    ) -> None:
        with pytest.raises(ValueError, match="positive x"):
            service.log_base(-4, 2)

    def test_log_base_zero_raises_value_error(
        self, service: ScientificCalculatorService
    ) -> None:
        with pytest.raises(ValueError, match="positive base"):
            service.log_base(8, 0)

    def test_log_base_negative_raises_value_error(
        self, service: ScientificCalculatorService
    ) -> None:
        with pytest.raises(ValueError, match="positive base"):
            service.log_base(8, -2)

    def test_log_base_one_raises_value_error(
        self, service: ScientificCalculatorService
    ) -> None:
        with pytest.raises(ValueError, match="base cannot be 1"):
            service.log_base(8, 1)


class TestExp:
    """Tests for the exponential operation."""

    def test_exp_zero(self, service: ScientificCalculatorService) -> None:
        assert service.exp(0) == pytest.approx(1.0)

    def test_exp_one(self, service: ScientificCalculatorService) -> None:
        assert service.exp(1) == pytest.approx(math.e)

    def test_exp_negative(self, service: ScientificCalculatorService) -> None:
        assert service.exp(-1) == pytest.approx(1 / math.e)

    def test_exp_positive(self, service: ScientificCalculatorService) -> None:
        assert service.exp(2) == pytest.approx(math.e**2)


class TestPower:
    """Tests for the power operation."""

    def test_power_integer_exponent(self, service: ScientificCalculatorService) -> None:
        assert service.power(2, 3) == pytest.approx(8.0)

    def test_power_float_exponent(self, service: ScientificCalculatorService) -> None:
        assert service.power(4, 0.5) == pytest.approx(2.0)

    def test_power_zero_exponent(self, service: ScientificCalculatorService) -> None:
        assert service.power(99, 0) == pytest.approx(1.0)

    def test_power_negative_exponent(self, service: ScientificCalculatorService) -> None:
        assert service.power(2, -1) == pytest.approx(0.5)


class TestCompute:
    """Tests for the compute() dispatch method."""

    def test_compute_factorial(self, service: ScientificCalculatorService) -> None:
        assert service.compute("factorial", 5) == 120.0

    def test_compute_log(self, service: ScientificCalculatorService) -> None:
        assert service.compute("log", math.e) == pytest.approx(1.0)

    def test_compute_log10(self, service: ScientificCalculatorService) -> None:
        assert service.compute("log10", 10) == pytest.approx(1.0)

    def test_compute_exp(self, service: ScientificCalculatorService) -> None:
        assert service.compute("exp", 0) == pytest.approx(1.0)

    def test_compute_power(self, service: ScientificCalculatorService) -> None:
        assert service.compute("power", 2, 3) == pytest.approx(8.0)

    def test_compute_log_base(self, service: ScientificCalculatorService) -> None:
        assert service.compute("log_base", 8, 2) == pytest.approx(3.0)

    def test_compute_power_missing_operand_b_raises(
        self, service: ScientificCalculatorService
    ) -> None:
        with pytest.raises(ValueError, match="operand_b"):
            service.compute("power", 2)

    def test_compute_log_base_missing_operand_b_raises(
        self, service: ScientificCalculatorService
    ) -> None:
        with pytest.raises(ValueError, match="operand_b"):
            service.compute("log_base", 8)

    def test_compute_unknown_operation_raises(
        self, service: ScientificCalculatorService
    ) -> None:
        with pytest.raises(ValueError, match="Unknown scientific operation: sqrt"):
            service.compute("sqrt", 9)
