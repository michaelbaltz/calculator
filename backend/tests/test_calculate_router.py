"""Integration tests for the /api/calculate router and /health endpoint."""

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(name="client")
def fixture_client() -> TestClient:
    """Return a TestClient wrapping the FastAPI application."""
    return TestClient(app)


class TestHealthEndpoint:
    """Tests for the liveness check endpoint."""

    def test_health_returns_200(self, client: TestClient) -> None:
        response = client.get("/health")
        assert response.status_code == 200

    def test_health_returns_ok_status(self, client: TestClient) -> None:
        response = client.get("/health")
        assert response.json() == {"status": "ok"}


class TestCalculateSuccess:
    """Tests for successful arithmetic operations via the POST endpoint."""

    def test_add(self, client: TestClient) -> None:
        response = client.post("/api/calculate", json={"operand_a": 3, "operand_b": 4, "operator": "+"})
        assert response.status_code == 200
        assert response.json()["result"] == 7.0

    def test_subtract(self, client: TestClient) -> None:
        response = client.post("/api/calculate", json={"operand_a": 10, "operand_b": 3, "operator": "-"})
        assert response.status_code == 200
        assert response.json()["result"] == 7.0

    def test_multiply(self, client: TestClient) -> None:
        response = client.post("/api/calculate", json={"operand_a": 6, "operand_b": 7, "operator": "*"})
        assert response.status_code == 200
        assert response.json()["result"] == 42.0

    def test_divide(self, client: TestClient) -> None:
        response = client.post("/api/calculate", json={"operand_a": 20, "operand_b": 4, "operator": "/"})
        assert response.status_code == 200
        assert response.json()["result"] == 5.0

    def test_response_includes_expression(self, client: TestClient) -> None:
        response = client.post("/api/calculate", json={"operand_a": 2, "operand_b": 3, "operator": "+"})
        data = response.json()
        assert "expression" in data
        assert data["expression"] == "2.0 + 3.0"

    def test_response_echoes_operands_and_operator(self, client: TestClient) -> None:
        payload = {"operand_a": 5, "operand_b": 2, "operator": "-"}
        response = client.post("/api/calculate", json=payload)
        data = response.json()
        assert data["operand_a"] == 5.0
        assert data["operand_b"] == 2.0
        assert data["operator"] == "-"


class TestCalculateErrors:
    """Tests for error handling in the calculate endpoint."""

    def test_divide_by_zero_returns_400(self, client: TestClient) -> None:
        response = client.post("/api/calculate", json={"operand_a": 5, "operand_b": 0, "operator": "/"})
        assert response.status_code == 400
        data = response.json()
        assert data["error"] == "Calculation error"
        assert "Division by zero" in data["detail"]

    def test_missing_field_returns_422(self, client: TestClient) -> None:
        response = client.post("/api/calculate", json={"operand_a": 5, "operator": "+"})
        assert response.status_code == 422

    def test_invalid_operator_returns_422(self, client: TestClient) -> None:
        response = client.post("/api/calculate", json={"operand_a": 5, "operand_b": 2, "operator": "%"})
        assert response.status_code == 422
