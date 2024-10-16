import { Request, Response } from "express";
import { IAuthResponse, IUserLoginBody } from "../../models/auth/auth.model";
import bcrypt from "bcrypt";
import { IPayload } from "../../models/auth/payload";
import jwt from "jsonwebtoken";
import { jwtOptions } from "../../middleware/authorization.middleware";
import db from "../../configs/pg";
import sendMail from "../../helpers/nodemailer";
import getLink from "../../helpers/getLink";
import { IRegisterResponse, IUserProfileResponse, IUserRegisterBody, IUsersQuery,} from "../../models/auth/user.model";
import { createData, getAllData, getTotalData, updateData,
} from "../../repository/auth/user.repository";
import { createDataProfile } from "../../repository/auth/profile.repository";
import { GetByEmail } from "../../repository/auth/auth.repository";
import { IProfileBody } from "../../models/auth/profile.model";



export const register = async ( req: Request<{}, {}, IUserRegisterBody>, res: Response<IRegisterResponse>) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");
    const { user_pass, user_email } = req.body;

    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!emailRegex.test(user_email)) {
      return res.status(400).json({
        code: 400,
        msg: "Registration failed",
        error: {
          message: "Email must end with @gmail.com.",
        },
      });
    }

    if (user_pass.length < 6) {
      return res.status(400).json({
        code:400,
        msg: "Registration failed",
        error: {
          message: "Password must be at least 6 characters long.",
        },
      });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user_pass, salt);

    const createUserResult = await createData(
      hashedPassword,
      user_email,
      client
    );
    const userId = createUserResult.rows[0]?.id;

    if (!userId) {
      throw new Error("User ID not found in result");
    }

    const emailSent = await sendMail(user_email);
    if (!emailSent) {
      await client.query("ROLLBACK");
      return res.status(500).json({
        code: 500,
        msg: "Error",
        error: {
          message: "Failed to send email",
        },
      });
    }

    const defaultProfile: IProfileBody = {
      full_name: "full name",
      phone_number: "phone number",
      address: "address",
      profile_image:
        "https://res.cloudinary.com/drppjxoxb/image/upload/v1727346163/coffeeshops/profileDefault.jpg",
    };

    await createDataProfile(userId, defaultProfile, client);

    await client.query("COMMIT");

    return res.status(201).json({
      code: 201,
      msg: "Register success",
      data: createUserResult.rows,
    });

  } catch (err) {
    await client.query("ROLLBACK");

    if (err instanceof Error) {
      if (err.message.includes('duplicate key value violates unique constraint "users_user_email_key"')) {
        return res.status(409).json({
          code: 409,
          msg: "Registration failed",
          error: {
            message: "Email already registered. Please login or use a different email.",
          },
        });
      }

      if (/(invalid(.)+id(.)+)/g.test(err.message)) {
        return res.status(401).json({
          code: 401,
          msg: "Error",
          error: {
            message: "User not found",
          },
        });
      }

      return res.status(400).json({
        code: 400,
        msg: "Error",
        error: {
          message: err.message,
        },
      });
    }

    return res.status(500).json({
      code: 500,
      msg: "Error",
      error: {
        message: "Internal Server Error",
      },
    });
  } finally {
    client.release();
  }
};


export const login = async ( req: Request<{}, {}, IUserLoginBody>, res: Response<IAuthResponse>) => {
  const { user_email, user_pass } = req.body;
  try {
    const result = await GetByEmail(user_email);

    if (!result.rows.length)
      throw new Error("The email you entered is incorrect");

    const { user_pass: hash, id, role } = result.rows[0];
    console.log('Fetched role from DB:', role);

    const isPwdValid = await bcrypt.compare(user_pass, hash);
    if (!isPwdValid) 
      throw new Error("The password you entered is incorrect");

    const payload: IPayload = {
      user_email: user_email,
      role: role,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      jwtOptions
    );

    return res.status(200).json({
      code:200,
      msg: `Welcome, ${user_email}!`,
      data: [{ token, id , role}]
    });

  } catch (error) {
    if (error instanceof Error) {
      if (/(invalid(.)+id(.)+)/g.test(error.message)) {
        return res.status(401).json({
          code: 401,
          msg: "Error",
          error: {
            message: "User not found",
          },
        });
      }

      return res.status(401).json({
        code: 401,
        msg: "Error",
        error: {
          message: error.message,
        },
      });
    }

    return res.status(500).json({
      code: 500,
      msg: "Error",
      error: {
        message: "Internal Server Error",
      },
    });
  }
};


export const FetchAll = async (req: Request<{}, {}, {}, IUsersQuery>, res: Response<IUserProfileResponse>) => {
  try {
    const result = await getAllData(req.query);
    if (!result || !result.rows.length) {
      return res.status(404).json({
        code: 404,
        msg: "Error",
        error: {
          message: "Data Not Found",
        },
      });
    }

    const dataProduct = await getTotalData();
    const page = parseInt(req.query.page as string) || 1; // Default to 1
    const limit = parseInt(req.query.limit as string) || 4; // Default to 4
    const totalData = parseInt(dataProduct.rows[0]?.total_user || "0", 10);
    const totalPage = Math.ceil(totalData / limit);

    const response = {
      code: 200,
      msg: "User profile successfully retrieved",
      data: result.rows,
      meta: {
        totalData,
        totalPage,
        page,
        prevLink: page > 1 ? getLink(req, "previous") : null,
        nextLink: page < totalPage ? getLink(req, "next") : null,
      },
    };

    return res.status(200).json(response);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    }

    return res.status(500).json({
      code: 500,
      msg: "Error",
      error: {
        message: "Internal Server Error",
      },
    });
  }
};


export const update = async (req: Request, res: Response<IRegisterResponse>) => {
  const { id } = req.params;
  const { user_pass } = req.body;

  try {
    // Validate password length
    if (user_pass && user_pass.length < 6) {
      return res.status(400).json({
        code: 400,
        msg: "Registration failed",
        error: {
          message: "Password must be at least 6 characters long.",
        },
      });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user_pass, salt);

    // Update the user data in the database
    const result = await updateData(id, req.body, hashedPassword);
    return res.status(200).json({
      code: 200,
      msg: "User has been upgraded",
      data: result.rows,
    });

  } catch (err: unknown) {
    let errorMessage = "Internal Server Error";

    if (err instanceof Error) {
      errorMessage = err.message;

      // Specific error handling for database query issues
      if (errorMessage.includes('syntax error at or near "WHERE"')) {
        return res.status(400).json({
          code: 400,
          msg: "Error",
          error: {
            message: "Error in the database query.",
          },
        });
      }
    }

    return res.status(500).json({
      code: 500,
      msg: "Error",
      error: {
        message: errorMessage,
      },
    });
  }
};