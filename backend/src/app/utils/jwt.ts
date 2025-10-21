import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  email: string;
}

export function signJwt(payload: JwtPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "dev", {
    expiresIn: "7d",
  });
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, process.env.JWT_SECRET || "dev") as JwtPayload;
}
