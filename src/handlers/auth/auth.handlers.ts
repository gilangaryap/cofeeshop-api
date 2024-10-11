import { Request, Response } from "express";
import { IUserLoginBody } from "../../models/auth/auth.model";
import bcrypt from "bcrypt";
import { IPayload } from "../../models/payload";
import jwt from "jsonwebtoken";
import { jwtOptions } from "../../middleware/authorization.middleware";
import db from "../../configs/pg";
import sendMail from "../../helpers/nodemailer";
import getLink from "../../helpers/getLink";
import { IAuthResponse } from "../../models/response";
import { IProfileBody } from "../../models/profile.model";
import { IUserRegisterBody, IUserResponse, IUsersQuery } from "../../models/auth/user.model";
import { createData, getAllData, getTotalData, updateData } from "../../repository/auth/user.repository";
import { createDataProfile } from "../../repository/auth/profile.repository";
import { GetByEmail } from "../../repository/auth/auth.repository";

export const register = async (req: Request<{}, {}, IUserRegisterBody>, res: Response) => {
  const client = await db.connect();

  try {
    await client.query('BEGIN');
    
    const { user_pass, user_email } = req.body;

    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!emailRegex.test(user_email)) {
      return res.status(400).json({
        msg: 'Registration failed',
        err: 'Email must end with @gmail.com.',
      });
    }

    if (user_pass.length < 6) {
      return res.status(400).json({
        msg: 'Registration failed',
        err: 'Password must be at least 6 characters long.',
      });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user_pass, salt);

    const createUserResult = await createData(hashedPassword, user_email, client);
    const userId = createUserResult.rows[0]?.id;

    if (!userId) {
      throw new Error('User ID not found in result');
    }

    const emailSent = await sendMail(user_email);
    if (!emailSent) {
      await client.query("ROLLBACK");
      return res.status(500).json({
        msg: "Error",
        err: "Failed to send email",
      });
    }

    const defaultProfile: IProfileBody = {
      full_name: 'full name',
      phone_number: 'phone number',
      address: 'address',
      profile_image:"https://res.cloudinary.com/drppjxoxb/image/upload/v1727346163/coffeeshops/profileDefault.jpg"
    };
    
    await createDataProfile(userId, defaultProfile, client);

    await client.query('COMMIT');

    return res.status(201).json({
      msg: 'Register success',
      data: createUserResult.rows[0],
    });
  } catch (err) {
    await client.query('ROLLBACK');
    
    if (err instanceof Error) {
      if (err.message.includes('duplicate key value violates unique constraint "users_user_email_key"')) {
        return res.status(409).json({ 
          msg: 'Registration failed',
          err: 'Email already registered. Please login or use a different email.',
        });
      }

      if (/(invalid(.)+id(.)+)/g.test(err.message)) {
        return res.status(401).json({
          msg: 'Error',
          err: 'User not found',
        });
      }

      return res.status(400).json({ 
        msg: 'Error',
        err: err.message,
      });
    }

    return res.status(500).json({
      msg: 'Error',
      err: 'Internal Server Error',
    });
  } finally {
    client.release();
  }
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
        msg: `Welcome, ${user_email}!`,
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
            err: "User not found",
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
    const dataUser = await getTotalData();
    const page = parseInt((req.query.page as string) ||"1", 10);
    const totalData = parseInt(dataUser.rows[0].total_user);
    const totalPage = Math.ceil(totalData / parseInt(query.limit || "2", 10));
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

export const update = async (req: Request,res: Response<IUserResponse>) => {
  const { id } = req.params;
  const { user_pass , user_email } = req.body;

  try {
    if (user_pass.length < 6) {
      return res.status(400).json({
        msg: 'Registration failed',
        err: 'Password must be at least 6 characters long.',
      });
    }
    let hashedPassword: string | undefined;
    if (user_pass) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(user_pass, salt);
    }

    const result = await updateData(id, req.body, hashedPassword);
    return res.status(200).json({
      msg: "user has been upgraded",
      data: result.rows,
    });
  } catch (err: unknown) {
    let errorMessage = "Internal Server Error";
    if (err instanceof Error) {
      errorMessage = err.message;
      if (errorMessage.includes('syntax error at or near "WHERE"')) {
        errorMessage =
          "Error in writing email";
        return res.status(400).json({
          msg: "Error",
          err: errorMessage,
        });
      }
    }
    return res.status(500).json({
      msg: "Error",
      err: errorMessage,
    });
  }
};