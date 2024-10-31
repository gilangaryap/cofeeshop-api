import { Request, Response } from "express";
import { createData, getAllData, getTotalTestimonialData } from "../../repository/auth/testimonial.repository";
import getLink from "../../helpers/getLink";
import { IUsersQuery } from "../../models/auth/user.model";
import { ITestimonialResponse } from "../../models/auth/testimonial.model";

export const create = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await createData(req.body, id);
    return res.status(201).json({
      msg: "thanks for the suggestion",
      data: result.rows,
    });
  } catch (err: unknown) {
    console.error("Error details:", err);
    if (err instanceof Error) {
      return res.status(500).json({
        msg: "Error",
        error: err.message,
      });
    } else {
      return res.status(500).json({
        msg: "Error",
        error: "Internal Server Error",
      });
    }
  }
};

export const FetchAll = async (req: Request<{}, {}, {}, IUsersQuery>,res: Response<ITestimonialResponse>) => {
  try {
    const result = await getAllData(req.query);
    const dataUser = await getTotalTestimonialData();
    const page = parseInt((req.query.page as string) || "1");
    const totalData = parseInt(dataUser.rows[0].total_user);
    const totalPage = Math.ceil(totalData / parseInt(req.query.limit || "2"));
    console.log(req.baseUrl);
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
