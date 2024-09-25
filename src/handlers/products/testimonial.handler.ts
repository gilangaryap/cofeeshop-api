import { Request, Response } from "express";
import { createData, getAllData, getTotalTestimonialData } from "../../repository/products/testimonial.repository";
import getLink from "../../helpers/getLink";
import { IUsersQuery } from "../../models/auth/user.model";
import { ITestimonialResponse } from "../../models/products/testimonial.model";

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
    // Mendapatkan total produk
    const dataUser = await getTotalTestimonialData();
    // Mendapatkan nomor halaman saat ini
    const page = parseInt((req.query.page as string) || "1");
    // Mendapatkan total data produk dari hasil penghitungan
    const totalData = parseInt(dataUser.rows[0].total_user);
    // Menghitung total halaman berdasarkan total data dan batasan (limit) data per halaman
    const totalPage = Math.ceil(totalData / parseInt(req.query.limit || "2"));
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
