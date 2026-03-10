"""Service layer containing core arithmetic and scientific logic for the calculator."""

import math
from typing import Optional


class CalculatorService:
    """Performs basic arithmetic operations on two floating-point operands."""

    def calculate(self, operand_a: float, operand_b: float, operator: str) -> float:
        """Evaluate a binary arithmetic expression.

        Args:
            operand_a: The left-hand operand.
            operand_b: The right-hand operand.
            operator: One of '+', '-', '*', or '/'.

        Returns:
            The floating-point result of the operation.

        Raises:
            ValueError: If the operator is '/' and operand_b is zero.
            ValueError: If the operator is not one of the supported symbols.
        """
        if operator == "+":
            return operand_a + operand_b
        if operator == "-":
            return operand_a - operand_b
        if operator == "*":
            return operand_a * operand_b
        if operator == "/":
            if operand_b == 0:
                raise ValueError("Division by zero")
            return operand_a / operand_b
        raise ValueError(f"Unknown operator: {operator}")


class ScientificCalculatorService:
    """Performs scientific mathematical operations using Python's math module."""

    def factorial(self, n: float) -> float:
        """Compute the factorial of a non-negative integer.

        Args:
            n: The value to compute the factorial of. Must be a non-negative integer.

        Returns:
            The factorial of n as a float.

        Raises:
            ValueError: If n is negative or not an integer.
        """
        if n != int(n):
            raise ValueError(
                f"factorial() requires a non-negative integer, got {n}"
            )
        n_int = int(n)
        if n_int < 0:
            raise ValueError(
                f"factorial() not defined for negative values, got {n}"
            )
        return float(math.factorial(n_int))

    def log(self, x: float) -> float:
        """Compute the natural logarithm (base e) of x.

        Args:
            x: The value to compute the natural log of. Must be positive.

        Returns:
            The natural logarithm of x.

        Raises:
            ValueError: If x is less than or equal to zero.
        """
        if x <= 0:
            raise ValueError(
                f"log() requires a positive argument, got {x}"
            )
        return math.log(x)

    def log10(self, x: float) -> float:
        """Compute the base-10 logarithm of x.

        Args:
            x: The value to compute log base 10 of. Must be positive.

        Returns:
            The base-10 logarithm of x.

        Raises:
            ValueError: If x is less than or equal to zero.
        """
        if x <= 0:
            raise ValueError(
                f"log10() requires a positive argument, got {x}"
            )
        return math.log10(x)

    def log_base(self, x: float, base: float) -> float:
        """Compute the logarithm of x with an arbitrary base.

        Args:
            x: The value to compute the logarithm of. Must be positive.
            base: The logarithm base. Must be positive and not equal to 1.

        Returns:
            The logarithm of x in the given base.

        Raises:
            ValueError: If x <= 0, base <= 0, or base == 1.
        """
        if x <= 0:
            raise ValueError(
                f"log_base() requires a positive x argument, got {x}"
            )
        if base <= 0:
            raise ValueError(
                f"log_base() requires a positive base, got {base}"
            )
        if base == 1:
            raise ValueError(
                "log_base() base cannot be 1 (undefined logarithm)"
            )
        return math.log(x, base)

    def exp(self, x: float) -> float:
        """Compute e raised to the power of x.

        Args:
            x: The exponent.

        Returns:
            e^x.
        """
        return math.exp(x)

    def power(self, x: float, y: float) -> float:
        """Compute x raised to the power y.

        Args:
            x: The base.
            y: The exponent.

        Returns:
            x^y.
        """
        return math.pow(x, y)

    def compute(
        self, operation: str, operand: float, operand_b: Optional[float] = None
    ) -> float:
        """Dispatch a scientific operation by name.

        Args:
            operation: One of 'factorial', 'log', 'log10', 'exp', 'power', 'log_base'.
            operand: The primary operand.
            operand_b: The secondary operand, required for 'power' and 'log_base'.

        Returns:
            The floating-point result.

        Raises:
            ValueError: If the operation is unknown, inputs are invalid, or a
                required second operand is missing.
        """
        if operation == "factorial":
            return self.factorial(operand)
        if operation == "log":
            return self.log(operand)
        if operation == "log10":
            return self.log10(operand)
        if operation == "exp":
            return self.exp(operand)
        if operation == "power":
            if operand_b is None:
                raise ValueError("power() requires operand_b (the exponent)")
            return self.power(operand, operand_b)
        if operation == "log_base":
            if operand_b is None:
                raise ValueError("log_base() requires operand_b (the base)")
            return self.log_base(operand, operand_b)
        raise ValueError(f"Unknown scientific operation: {operation}")
