import * as express from "express-serve-static-core";
import { IPayload } from "./src/models/auth/payload";


declare global {
  namespace Express {
    export interface Request {
      userPayload?: IPayload | string;
    }
  }
}
