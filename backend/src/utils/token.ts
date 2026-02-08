import jwt from "jsonwebtoken";
export interface TokenUser {
  uuid: string;
  username: string;
  email: string;
}

export function generateToken(payload: TokenUser) {
  const token = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: "1y" });
  return token;
}
