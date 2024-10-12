import { NextFunction, Request, Response } from "express-serve-static-core";
import jwt, { SignOptions } from "jsonwebtoken";
import { IPayload } from "../models/auth/payload";
import { IAuthResponse } from "../models/response";
import { AppParams } from "../models/params.model";

export const jwtOptions: SignOptions = {
  expiresIn: "5m",
  issuer: process.env.JWT_ISSUER,
};

export const authorization =
  (roles: string) =>( req: Request<AppParams>, res: Response<IAuthResponse>, next: NextFunction) => {
    const bearerToken = req.header("Authorization");
    if (!bearerToken) {
      return res.status(403).json({
        msg: "Forbidden",
        err: "no access",
      });
    }
    const token = bearerToken.split(" ")[1];
    jwt.verify( token, <string>process.env.JWT_SECRET, jwtOptions, (err, payload) => {
        if (err) {
          return res.status(403).json({
            msg: err.message,
            err: err.name,
          });
        }
        const userPayload = payload as IPayload;
        if (roles) {
          if (!roles.includes(userPayload.iss)) {
            return res.status(403).json({
              msg: "Forbidden",
              err: "Access denied, insufficient permissions",
            });
          }
        }
        req.userPayload = payload as IPayload;
        next();
      }
    );
  };
