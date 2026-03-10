const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Sends a calculation request to the backend API.
 * @param {number} operand_a - The first operand.
 * @param {number} operand_b - The second operand.
 * @param {string} operator - The operator (+, -, *, /).
 * @return {Promise<Object>} The result object from the API.
 */
export async function calculate(operand_a, operand_b, operator) {
  const response = await fetch(`${API_URL}/api/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operand_a, operand_b, operator }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Calculation failed');
  }
  return response.json();
}

/**
 * Sends a calculus request to the backend API.
 * @param {string} operation - The calculus operation: derivative, integral, or definite_integral.
 * @param {string} expression - The mathematical expression string.
 * @param {string} variable - The variable of differentiation/integration.
 * @param {string|null} [lower=null] - Lower bound for definite integrals.
 * @param {string|null} [upper=null] - Upper bound for definite integrals.
 * @return {Promise<Object>} The result object from the API.
 */
export async function calculus(operation, expression, variable, lower = null, upper = null) {
  const response = await fetch(`${API_URL}/api/calculus`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation, expression, variable, lower, upper }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Calculation failed');
  }
  return response.json();
}

/**
 * Sends a scientific calculation request to the backend API.
 * @param {string} operation - The scientific operation name.
 * @param {number} operand - The primary operand.
 * @param {number|null} [operand_b=null] - The optional second operand (for binary ops).
 * @return {Promise<Object>} The result object from the API.
 */
export async function scientific(operation, operand, operand_b = null) {
  const response = await fetch(`${API_URL}/api/scientific`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation, operand, operand_b }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Calculation failed');
  }
  return response.json();
}
