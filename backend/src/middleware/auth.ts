import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthUser { id: string; email: string }

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function signToken(user: AuthUser) {
  return jwt.sign(user, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

function readUser(req: Request): AuthUser | null {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  try {
    const d = jwt.verify(header.slice(7), env.JWT_SECRET) as jwt.JwtPayload;
    return { id: d.id, email: d.email };
  } catch {
    return null;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = readUser(req);
  if (!user) {
    res.status(401).json({ message: "Sign in required" });
    return;
  }
  req.user = user;
  next();
}

// Never blocks. Sets req.user if a valid token is present.
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const user = readUser(req);
  if (user) req.user = user;
  next();
}
