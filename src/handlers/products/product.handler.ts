import { Request, Response } from "express";
import { IProductBody } from "../../models/products/product.model";
import db from "../../configs/pg";
import { createData, createDataImage } from "../../repository/products/product.repository";
import { cloudinaryUploader } from "../../helpers/cloudinary";

export const create = async (req: Request<{}, {}, IProductBody>, res: Response) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const productResult = await createData(req.body);
    const product = productResult.rows[0];
    
    if (!product || !product.product_name) {
      throw new Error('Failed to create product: product_name is undefined');
    }

    const resultName = product.product_name.split(' ')[0];
    if (!resultName) {
      throw new Error('Failed to create product');
    }

    const productId = product.id;
    if (!productId) {
      throw new Error('Failed to create product');
    }

    const { result, error } = await cloudinaryUploader(req, 'product', resultName);
    if (error) {
      throw new Error(error.message);
    }
    if (!result || !result.secure_url) {
      throw new Error('Failed to upload image');
    }

    const imgProductResult = await createDataImage(client, productId, result.secure_url);
    const imgProduct = imgProductResult.rows[0];

    await client.query('COMMIT');

    return res.status(201).json({
      status: 'success',
      data: {
        product,
        imgProduct,
      },
    });

  }catch (err) {
    console.error("Error in createNewProduct:", err);
    if (err instanceof Error) {
      if (
        err.message.includes(
          'duplicate key value violates unique constraint "product_name"'
        )
      ) {
        return res.status(400).json({
          msg: "Error",
          err: "Product name already exists",
        });
      }
      if (err.message.includes("File not found")) {
        return res.status(400).json({
          msg: "Error",
          err: "product image cannot be null",
        });
      }
    }
    return res.status(500).json({
      msg: "Error",
      err: "Internal Server Error",
    });
  }
};