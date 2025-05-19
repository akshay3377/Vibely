const crypto = require("crypto");

export function generateRandomId(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2) )
    .toString("hex")
    .slice(0, length);
}
