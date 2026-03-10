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
