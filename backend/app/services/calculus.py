"""Service layer containing symbolic calculus logic using SymPy."""

from typing import Optional

import sympy


class CalculusService:
    """Performs symbolic differentiation and integration using SymPy."""

    def _parse(self, expression: str, variable: str) -> tuple:
        """Parse the expression string and variable name into SymPy objects.

        Args:
            expression: A mathematical expression string, e.g. "x**2 + 3*x".
            variable: The variable name string, e.g. "x".

        Returns:
            A tuple of (sympy_expr, sympy_symbol).

        Raises:
            ValueError: If the expression cannot be parsed by SymPy.
        """
        try:
            sym_var = sympy.Symbol(variable)
            sym_expr = sympy.sympify(expression)
        except (sympy.SympifyError, TypeError, ValueError) as exc:
            raise ValueError(f"Invalid expression: {expression}") from exc
        return sym_expr, sym_var

    def derivative(self, expression: str, variable: str) -> str:
        """Compute the symbolic derivative of an expression with respect to a variable.

        Args:
            expression: A mathematical expression string, e.g. "x**2 + 3*x".
            variable: The variable to differentiate with respect to.

        Returns:
            The symbolic derivative as a string.

        Raises:
            ValueError: If the expression cannot be parsed.
        """
        sym_expr, sym_var = self._parse(expression, variable)
        result = sympy.diff(sym_expr, sym_var)
        return str(result)

    def integral(self, expression: str, variable: str) -> str:
        """Compute the indefinite symbolic integral of an expression.

        Args:
            expression: A mathematical expression string, e.g. "x**2 + 3*x".
            variable: The variable to integrate with respect to.

        Returns:
            The symbolic antiderivative as a string (no constant of integration).

        Raises:
            ValueError: If the expression cannot be parsed.
        """
        sym_expr, sym_var = self._parse(expression, variable)
        result = sympy.integrate(sym_expr, sym_var)
        return str(result)

    def definite_integral(
        self,
        expression: str,
        variable: str,
        lower: float,
        upper: float,
    ) -> str:
        """Compute the definite integral of an expression over [lower, upper].

        Args:
            expression: A mathematical expression string, e.g. "x**2".
            variable: The variable to integrate with respect to.
            lower: The lower bound of integration.
            upper: The upper bound of integration.

        Returns:
            The numeric result of the definite integral as a string.

        Raises:
            ValueError: If the expression cannot be parsed.
        """
        sym_expr, sym_var = self._parse(expression, variable)
        result = sympy.integrate(sym_expr, (sym_var, lower, upper))
        return str(float(result))

    def compute(
        self,
        operation: str,
        expression: str,
        variable: str,
        lower: Optional[float] = None,
        upper: Optional[float] = None,
    ) -> str:
        """Dispatch a calculus operation by name.

        Args:
            operation: One of 'derivative', 'integral', 'definite_integral'.
            expression: A mathematical expression string.
            variable: The variable name string.
            lower: The lower bound, required for 'definite_integral'.
            upper: The upper bound, required for 'definite_integral'.

        Returns:
            The result as a string (symbolic or numeric).

        Raises:
            ValueError: If the operation is unknown, expression is invalid,
                or bounds are missing for a definite integral.
        """
        if operation == "derivative":
            return self.derivative(expression, variable)
        if operation == "integral":
            return self.integral(expression, variable)
        if operation == "definite_integral":
            if lower is None or upper is None:
                raise ValueError(
                    "lower and upper bounds are required for definite_integral"
                )
            return self.definite_integral(expression, variable, lower, upper)
        raise ValueError(f"Unknown operation: {operation}")
