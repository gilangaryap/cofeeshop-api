import { Request, Response } from "express";
import { IAuthResponse } from "../models/response";
import { GetByEmail } from "../repository/auth.repository";
import { IUserLoginBody } from "../models/auth.model";
import bcrypt from "bcrypt";
import { IPayload } from "../models/payload";
import jwt from "jsonwebtoken";
import { jwtOptions } from "../middleware/authorization.middleware";
import { IUserRegisterBody } from "../models/user.model";
import db from "../configs/pg";
import { createData } from "../repository/user.repository";
import sendMail from "../helpers/nodemailer";

export const login = async (req: Request<{}, {}, IUserLoginBody>,res: Response<IAuthResponse>) => {
    const { user_email , user_pass } = req.body;
    try {
      const result = await GetByEmail(user_email);
      if (!result.rows.length)
        throw new Error("The email you entered is incorrect");
      const { user_pass: hash, uuid , id } = result.rows[0];
      const isPwdValid = await bcrypt.compare(user_pass, hash);
      if (!isPwdValid) throw new Error("The password you entered is incorrect");
      const payload: IPayload = {
        user_email: user_email,
      };
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET as string,
        jwtOptions
      );
      return res.status(200).json({
        msg: `Selamat datang, ${user_email}!`,
        data: [
          {
            token,
            uuid,
            id,
          },
        ],
      });
    } catch (error) {
      if (error instanceof Error) {
        if (/(invalid(.)+id(.)+)/g.test(error.message)) {
          return res.status(401).json({
            msg: "Error",
            err: "user tidak ditemukan",
          });
        }
        return res.status(401).json({
          msg: "Error",
          err: error.message,
        });
      }
      return res.status(500).json({
        msg: "Error",
        err: "Internal Server Error",
      });
    }
};

export const register = async (req: Request<{}, {}, IUserRegisterBody>,res: Response) => {
  
  try {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const { user_pass, user_email } = req.body;

      const salt = await bcrypt.genSalt();
      const hashed = await bcrypt.hash(user_pass, salt);

      const newUser = await createData( hashed, user_email);

      if (!newUser.rows.length) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          msg: "Error",
          err: "Failed to register user",
        });
      }

      const userUuid = newUser.rows[0].uuid;
      if (!userUuid) throw new Error("User code not found");

      const result = await sendMail(user_email, userUuid);

      if (!result) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          msg: "Error",
          err: "Failed to send email",
        });
      }

      await client.query("COMMIT");
      return res.status(201).json({
        msg: "Register Berhasil",
        data: result,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      msg: "Error",
      err: "Internal Server Error",
    });
  }
};