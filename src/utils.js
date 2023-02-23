import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) => {
  //console.log({ plainText: password, hash: user.password });
  return bcrypt.compareSync(password, user.password);
};

export default __dirname;



