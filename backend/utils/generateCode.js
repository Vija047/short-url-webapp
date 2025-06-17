import { nanoid } from "nanoid";

function generateCode() {
  return nanoid(8);
}

export default generateCode;
