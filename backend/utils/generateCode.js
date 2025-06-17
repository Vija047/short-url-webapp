const { nanoid } = require("nanoid");

function generateCode(length = 6) {
  return nanoid(length);
}

module.exports = generateCode;
