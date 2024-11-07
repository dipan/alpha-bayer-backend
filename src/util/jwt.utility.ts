import jwt from "jsonwebtoken";
import config from "../config/config";
import { NextFunction, Request, Response } from "express";
import { TEntity } from "../entity/entity";
import { ApiResponse } from "../api/api.router";

export default class JWTUtility {
  static generateToken(payload: TEntity, expirationTime?: string): string {
    // payload.exp = 10 * 1000;
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: expirationTime ?? config.jwt.expirationTime,
    });
  }

  static verifyToken(token: string): TEntity | null {
    return jwt.verify(token, config.jwt.secret) as TEntity;
  }

  static tokenValidationHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let token = req.headers.authorization;
    if (!token) {
      const resposne: ApiResponse = {
        status: 401,
        body: { message: "No Bearer Token", code: 401000 },
      };
      res.status(resposne.status).json(resposne.body);
    } else {
      token = token.slice(7);
      try {
        const payload = JWTUtility.verifyToken(token);
        res.locals.tokenPayload = payload;
        next();
      } catch (error: any) {
        const resposne: ApiResponse = {
          status: 401,
          body: { message: error.message, code: 401001 },
        };
        res.status(401).json(resposne);
      }
    }
  }

  static tokenPayloadRetriveHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let payload;
    let token = req.headers.authorization;
    if (token) {
      token = token.slice(7);
      try {
        payload = JWTUtility.verifyToken(token);
        res.locals.tokenPayload = payload;
      } catch (error: any) {}
    }
    next();
  }
}
