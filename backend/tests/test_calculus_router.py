"""Integration tests for the /api/calculus router."""

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(name="client")
def fixture_client() -> TestClient:
    """Return a TestClient wrapping the FastAPI application."""
    return TestClient(app)


class TestCalculusDerivative:
    """Tests for derivative via the POST /api/calculus endpoint."""

    def test_derivative_polynomial(self, client: TestClient) -> None:
        response = client.post(
            "/api/calculus",
            json={"operation": "derivative", "expression": "x**2 + 3*x", "variable": "x"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["result"] == "2*x + 3"
        assert data["operation"] == "derivative"
        assert data["expression"] == "x**2 + 3*x"
        assert data["variable"] == "x"
        assert data["lower"] is None
        assert data["upper"] is None

    def test_derivative_trig(self, client: TestClient) -> None:
        response = client.post(
            "/api/calculus",
            json={"operation": "derivative", "expression": "sin(x)", "variable": "x"},
        )
        assert response.status_code == 200
        assert response.json()["result"] == "cos(x)"

    def test_derivative_exponential(self, client: TestClient) -> None:
        response = client.post(
            "/api/calculus",
            json={"operation": "derivative", "expression": "exp(x)", "variable": "x"},
        )
        assert response.status_code == 200
        assert response.json()["result"] == "exp(x)"


class TestCalculusIntegral:
    """Tests for indefinite integral via the POST /api/calculus endpoint."""

    def test_integral_polynomial(self, client: TestClient) -> None:
        response = client.post(
            "/api/calculus",
            json={"operation": "integral", "expression": "x**2", "variable": "x"},
        )
        assert response.status_code == 200
        assert response.json()["result"] == "x**3/3"

    def test_integral_trig(self, client: TestClient) -> None:
        response = client.post(
            "/api/calculus",
            json={"operation": "integral", "expression": "cos(x)", "variable": "x"},
        )
        assert response.status_code == 200
        assert response.json()["result"] == "sin(x)"


class TestCalculusDefiniteIntegral:
    """Tests for definite integral via the POST /api/calculus endpoint."""

    def test_definite_integral_polynomial(self, client: TestClient) -> None:
        response = client.post(
            "/api/calculus",
            json={
                "operation": "definite_integral",
                "expression": "x**2",
                "variable": "x",
                "lower": 0.0,
                "upper": 3.0,
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert float(data["result"]) == pytest.approx(9.0)
        assert data["lower"] == 0.0
        assert data["upper"] == 3.0

    def test_definite_integral_missing_bounds_returns_400(
        self, client: TestClient
    ) -> None:
        response = client.post(
            "/api/calculus",
            json={
                "operation": "definite_integral",
                "expression": "x**2",
                "variable": "x",
            },
        )
        assert response.status_code == 400
        data = response.json()
        assert data["error"] == "Calculation error"
        assert "bounds" in data["detail"]

    def test_definite_integral_missing_upper_returns_400(
        self, client: TestClient
    ) -> None:
        response = client.post(
            "/api/calculus",
            json={
                "operation": "definite_integral",
                "expression": "x**2",
                "variable": "x",
                "lower": 0.0,
            },
        )
        assert response.status_code == 400
        assert "bounds" in response.json()["detail"]


class TestCalculusErrorHandling:
    """Tests for error handling on the /api/calculus endpoint."""

    def test_invalid_expression_returns_400(self, client: TestClient) -> None:
        response = client.post(
            "/api/calculus",
            json={"operation": "derivative", "expression": "x +* 3", "variable": "x"},
        )
        assert response.status_code == 400
        data = response.json()
        assert data["error"] == "Calculation error"
        assert "Invalid expression" in data["detail"]

    def test_missing_expression_returns_422(self, client: TestClient) -> None:
        response = client.post(
            "/api/calculus",
            json={"operation": "derivative", "variable": "x"},
        )
        assert response.status_code == 422

    def test_missing_variable_returns_422(self, client: TestClient) -> None:
        response = client.post(
            "/api/calculus",
            json={"operation": "derivative", "expression": "x**2"},
        )
        assert response.status_code == 422

    def test_missing_operation_returns_422(self, client: TestClient) -> None:
        response = client.post(
            "/api/calculus",
            json={"expression": "x**2", "variable": "x"},
        )
        assert response.status_code == 422

    def test_invalid_operation_returns_422(self, client: TestClient) -> None:
        response = client.post(
            "/api/calculus",
            json={"operation": "laplace", "expression": "x**2", "variable": "x"},
        )
        assert response.status_code == 422
