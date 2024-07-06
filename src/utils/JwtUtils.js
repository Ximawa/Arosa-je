/**
 * Decodes the payload from a JWT token and returns the data.
 * @param {string} token - The JWT token to decode.
 * @returns {Object} The decoded payload data.
 */
function decodeJwtPayload(token) {
  // Split the token into its parts
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT token");
  }

  // The payload is the second part of the token
  const payload = parts[1];

  // Decode the payload from base64 to a string
  const decodedPayload = atob(payload);

  // Parse the payload string into an object
  return JSON.parse(decodedPayload);
}

export { decodeJwtPayload };
