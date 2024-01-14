import jwt from "jsonwebtoken";
import { db } from "../config/database";
import { Response } from "express";

interface JwtPayload {
  id: number;
  role: string;
}

const secretKey = "secret-key";

const generateVerifyToken = async (id: number, role: string, res: Response) => {
  const token = jwt.sign({ id, role }, secretKey, { expiresIn: "1h" });

  // Set the token as a cookie with a specific name (e.g., "verifyToken")
  res.cookie("verifyToken", token, {
    sameSite: "none",
    secure: true,
    expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
  });

  return token;
};

const validateVerifyToken = async (token: string) => {
  return jwt.verify(token, secretKey) as JwtPayload;
};

export { generateVerifyToken, validateVerifyToken };
