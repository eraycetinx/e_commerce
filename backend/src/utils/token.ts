import jwt from "jsonwebtoken";
interface Payload {
  uuid: string;
  username: string;
  email: string;
}

export function generateToken(payload: Payload) {
  const token = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: "1y" });
  return token;
}
