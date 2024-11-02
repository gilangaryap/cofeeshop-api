import { NextFunction, Request, Response } from "express-serve-static-core";
import jwt, { SignOptions } from "jsonwebtoken";
import { IPayload } from "../models/auth/payload";
import { AppParams, QueryParams } from "../models/params.model";
import { IAuthResponse } from "../models/auth/auth.model";

export const jwtOptions: SignOptions = {
  expiresIn: "5m",
  issuer: process.env.JWT_ISSUER,
};

export const authorization =(roles: string[]) =>(req: Request<AppParams>, res: Response<IAuthResponse>, next: NextFunction)=> {
    const bearerToken = req.header("Authorization");
    if (!bearerToken) {
      return res.status(401).json({
        code: 401,
        msg: "Forbidden",
        error: {
          message: "No access",
        },
      });
    }

    const token = bearerToken.split(" ")[1];
    jwt.verify(
      token,
      <string>process.env.JWT_SECRET,
      jwtOptions,
      (err, payload) => {
        if (err) {
          return res.status(403).json({
            code: 403,
            msg: "Forbidden",
            error: {
              message: err.message,
            },
          });
        }

        const userPayload = payload as IPayload;
        if (roles && !roles.includes(userPayload.role)) {
          return res.status(403).json({
            code: 403,
            msg: "Forbidden",
            error: {
              message: "Access denied, insufficient permissions",
            },
          });
        }
        req.userPayload = payload as IPayload;
        next();
      }
    );
  };
