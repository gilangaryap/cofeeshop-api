import { Request, Response } from "express";
import { IPromoBody } from "../../models/products/promo.model";
import { createData } from "../../repository/products/promo.repository";
/* 
export const create = async (req: Request<{}, {}, IPromoBody>,res: Response) => {
    try {
        const name = req.body.product_id;
        let imageUrl: string | null = null;

        if (req.file) {
            const { result, error } = await cloudinaryUploader(req, "promo-image", name);

            if (error) {
                throw new Error(error.message);
            }

            if (!result || !result.secure_url) {
                throw new Error("Failed to upload image");
            }

            imageUrl = result.secure_url;
        }

        console.log('Inserting data:', {
          discount_price: req.body.discount_price,
          promo_name: req.body.promo_name,
          promo_description: req.body.promo_description,
          promo_img: imageUrl,
          product_id: req.body.product_id
      });


        const result = await createData(req.body,imageUrl as string);

        return res.status(201).json({
          msg: "success",
          data: result.rows,
        });
    } catch (err: unknown) {
      console.error('Error details:', err);
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
}; */