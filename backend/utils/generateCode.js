async function generateCode(length = 6) {
  const { nanoid } = await import('nanoid');
  return nanoid(length);
}

module.exports = generateCode;
