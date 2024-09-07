import { NextFunction, Request, Response } from "express-serve-static-core";
import jwt, { SignOptions } from "jsonwebtoken";
import { IPayload } from "../models/payload";
import { IAuthResponse } from "../models/response";
import { AppParams } from "../models/params.model";

export const jwtOptions: SignOptions = {
  expiresIn: "5m",
  issuer: process.env.JWT_ISSUER,
};

export const authorization =(role?: string[]) =>(req: Request<AppParams>,res: Response<IAuthResponse>,next: NextFunction) => {
    const bearerToken = req.header("Authorization");
    if (!bearerToken) {
      return res.status(403).json({
        msg: "Forbidden",
        err: "tidak memiliki akses",
      });
    }

    const token = bearerToken.split(" ")[1];
    jwt.verify(token,<string>process.env.JWT_SECRET,jwtOptions,(err, payload) => {
        // kalo tidak valid, ditolak
        if (err) {
          return res.status(403).json({
            msg: err.message,
            err: err.name,
          });
        }
        // pengecekan role
        if (role) {
          if (!role.includes((payload as IPayload).role as string)) {
            return res.status(403).json({
              msg: "Forbidden",
              err: "Akses tidak diperbolehkan",
            });
          }
        }
        // kalo valid, lanjut
        req.userPayload = payload as IPayload;
        next();
      }
    );
  };
