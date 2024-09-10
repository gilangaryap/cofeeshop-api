import { Request, Response } from "express";
import { GetByEmail } from "../repository/auth.repository";
import { IUserLoginBody } from "../models/auth.model";
import bcrypt from "bcrypt";
import { IPayload } from "../models/payload";
import jwt from "jsonwebtoken";
import { jwtOptions } from "../middleware/authorization.middleware";
import { IUserRegisterBody, IUserResponse, IUsersQuery } from "../models/user.model";
import db from "../configs/pg";
import { createData, getAllData, getTotalData } from "../repository/user.repository";
import sendMail from "../helpers/nodemailer";
import getLink from "../helpers/getLink";
import { IAuthResponse } from "../models/response";
import { ParsedQs } from 'qs'; 

export const register = async (req: Request<{}, {}, IUserRegisterBody>,res: Response) => {
  try{
    const { user_pass, user_email } = req.body;

    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(user_pass, salt);

    const result = await createData( hashed, user_email);
    return res.status(201).json({
      msg: "Register success",
      data: result.rows,
    });
  }catch(error){
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
  /* try {
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

      const result = await sendMail(user_email);

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
  } */
};

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

export const FetchAll = async (req: Request<{}, {}, {},IUsersQuery >,res: Response<IUserResponse>) => {
  try {
    const query = req.query as unknown as IUsersQuery;

    const result = await getAllData(query);
    // Mendapatkan total produk
    const dataUser = await getTotalData();
    // Mendapatkan nomor halaman saat ini
    const page = parseInt((req.query.page as string) ||"1", 10);
    // Mendapatkan total data produk dari hasil penghitungan
    const totalData = parseInt(dataUser.rows[0].total_user);
    // Menghitung total halaman berdasarkan total data dan batasan (limit) data per halaman
    const totalPage = Math.ceil(totalData / parseInt(query.limit || "2", 10));
    console.log(req.baseUrl);
    // Membentuk objek respons dengan pesan sukses, data produk, dan meta-informasi
    const response = {
      msg: "success",
      data: result.rows,
      meta: {
        totalData,
        totalPage,
        page,
        prevLink: page > 1 ? getLink(req, "previous") : null,
        nextLink: page != totalPage ? getLink(req, "next") : null,
      },
    };

    // Mengirimkan respons JSON dengan status 200 OK ke klien
    return res.status(200).json(response);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
    }
    return res.status(500).json({
      msg: "Error",
      err: "Internal Server Error",
    });
  }
};