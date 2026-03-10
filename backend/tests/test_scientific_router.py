"""Integration tests for the /api/scientific router."""

import math

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(name="client")
def fixture_client() -> TestClient:
    """Return a TestClient wrapping the FastAPI application."""
    return TestClient(app)


class TestScientificFactorial:
    """Tests for factorial via the POST /api/scientific endpoint."""

    def test_factorial_success(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific", json={"operation": "factorial", "operand": 5}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["result"] == 120.0
        assert data["expression"] == "5.0!"

    def test_factorial_zero(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific", json={"operation": "factorial", "operand": 0}
        )
        assert response.status_code == 200
        assert response.json()["result"] == 1.0

    def test_factorial_negative_returns_400(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific", json={"operation": "factorial", "operand": -3}
        )
        assert response.status_code == 400
        data = response.json()
        assert data["error"] == "Calculation error"
        assert "negative" in data["detail"]

    def test_factorial_non_integer_returns_400(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific", json={"operation": "factorial", "operand": 2.5}
        )
        assert response.status_code == 400
        data = response.json()
        assert "non-negative integer" in data["detail"]


class TestScientificLog:
    """Tests for natural log via the POST /api/scientific endpoint."""

    def test_log_success(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific", json={"operation": "log", "operand": math.e}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["result"] == pytest.approx(1.0)
        assert "log(" in data["expression"]

    def test_log_zero_returns_400(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific", json={"operation": "log", "operand": 0}
        )
        assert response.status_code == 400
        assert "positive" in response.json()["detail"]

    def test_log_negative_returns_400(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific", json={"operation": "log", "operand": -1}
        )
        assert response.status_code == 400


class TestScientificLog10:
    """Tests for log10 via the POST /api/scientific endpoint."""

    def test_log10_success(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific", json={"operation": "log10", "operand": 100}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["result"] == pytest.approx(2.0)
        assert data["expression"] == "log10(100.0)"

    def test_log10_zero_returns_400(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific", json={"operation": "log10", "operand": 0}
        )
        assert response.status_code == 400

    def test_log10_negative_returns_400(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific", json={"operation": "log10", "operand": -10}
        )
        assert response.status_code == 400


class TestScientificExp:
    """Tests for exp via the POST /api/scientific endpoint."""

    def test_exp_success(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific", json={"operation": "exp", "operand": 0}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["result"] == pytest.approx(1.0)
        assert data["expression"] == "exp(0.0)"

    def test_exp_one(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific", json={"operation": "exp", "operand": 1}
        )
        assert response.status_code == 200
        assert response.json()["result"] == pytest.approx(math.e)


class TestScientificPower:
    """Tests for power via the POST /api/scientific endpoint."""

    def test_power_success(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific",
            json={"operation": "power", "operand": 2, "operand_b": 3},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["result"] == pytest.approx(8.0)
        assert data["expression"] == "2.0 ^ 3.0"
        assert data["operand_b"] == 3.0

    def test_power_missing_operand_b_returns_400(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific", json={"operation": "power", "operand": 2}
        )
        assert response.status_code == 400
        assert "operand_b" in response.json()["detail"]


class TestScientificLogBase:
    """Tests for log_base via the POST /api/scientific endpoint."""

    def test_log_base_success(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific",
            json={"operation": "log_base", "operand": 8, "operand_b": 2},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["result"] == pytest.approx(3.0)
        assert data["expression"] == "log_2.0(8.0)"

    def test_log_base_x_zero_returns_400(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific",
            json={"operation": "log_base", "operand": 0, "operand_b": 2},
        )
        assert response.status_code == 400

    def test_log_base_base_one_returns_400(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific",
            json={"operation": "log_base", "operand": 8, "operand_b": 1},
        )
        assert response.status_code == 400
        assert "base cannot be 1" in response.json()["detail"]

    def test_log_base_missing_operand_b_returns_400(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific", json={"operation": "log_base", "operand": 8}
        )
        assert response.status_code == 400


class TestScientificValidation:
    """Tests for request validation on the /api/scientific endpoint."""

    def test_missing_operand_returns_422(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific", json={"operation": "log"}
        )
        assert response.status_code == 422

    def test_invalid_operation_returns_422(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific", json={"operation": "sqrt", "operand": 9}
        )
        assert response.status_code == 422

    def test_response_echoes_operation_and_operand(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific", json={"operation": "exp", "operand": 2}
        )
        data = response.json()
        assert data["operation"] == "exp"
        assert data["operand"] == 2.0

    def test_operand_b_is_none_for_unary_ops(self, client: TestClient) -> None:
        response = client.post(
            "/api/scientific", json={"operation": "log10", "operand": 10}
        )
        data = response.json()
        assert data["operand_b"] is None
