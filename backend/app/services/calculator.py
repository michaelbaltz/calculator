"""Service layer containing core arithmetic logic for the calculator."""


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
