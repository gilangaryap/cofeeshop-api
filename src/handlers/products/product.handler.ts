import { Request, Response } from "express";
import { IProductBody, IProductQuery, IProductResponse } from "../../models/products/product.model";
import db from "../../configs/pg";
import { createData, createDataImage, getAllData, getDetailData, getImgData, getTotalData, updateData } from "../../repository/products/product.repository";
import { cloudinaryUploader } from "../../helpers/cloudinary";
import getLink from "../../helpers/getLink";

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

export const FetchAll = async (req: Request<{}, {}, {}, IProductQuery>,res: Response<IProductResponse>) => {
  try {
    const result = await getAllData(req.query);
    if (!result) {
      return res.status(404).json({
        msg: "Error",
        err: "Data Not Found",
      });
    }
    const dataProduct = await getTotalData();

    const page = parseInt((req.query.page as string) || "1");

    const totalData = parseInt(dataProduct.rows[0].total_product);

    const totalPage = Math.ceil(totalData / parseInt(req.query.limit || "4"));

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
  } catch (err) {
    let errorMessage = "Internal Server Error";
    if (err instanceof Error) {
      errorMessage = err.message;
      if (errorMessage.includes("Sort invalid options")) {
        errorMessage =
          "Sort invalid options. Allowed options are: cheapest, priciest, a-z, z-a, latest, longest.";
      } else if (errorMessage.includes("Category invalid options")) {
        errorMessage =
          "Category invalid options. Allowed options are: drink, snack, heavy meal.";
      }
    }
    return res.status(500).json({
      msg: "Error",
      err: "Internal Server Error",
    });
  }
};

export const FetchDetail = async (req: Request, res: Response) => {
  const client = await db.connect();

  try {
    const { uuid } = req.params;

    try {
      await client.query("BEGIN");

      // Get product details
      const product = await getDetailData(uuid);
      if (!product.rows[0]) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          msg: "Product does not exist",
        });
      }

      // Get product ID
      const productId = product.rows[0].id;
      console.log(productId)
      if (!productId) {
        await client.query("ROLLBACK");
        throw new Error("Product ID does not exist");
      }

      // Get product image
      const imgProduct = await getImgData(client , productId);

      await client.query("COMMIT");

      console.log({
        product: product.rows[0],
        imgProduct: imgProduct.rows[0],
      });

      return res.status(200).json({
        msg: "Success",
        data: {
          product: product.rows[0],
          imgProduct: imgProduct.rows[0],
        },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error in getDetailProduct:", err);
    return res.status(500).json({
      msg: "Error",
      err: "Internal Server Error",
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const client = await db.connect();
    const {file,params: { uuid },body,} = req;
    try {
      await client.query("BEGIN");

      // Jika hanya product body yang terisi
      if (Object.keys(body).length > 0) {
        const product = await updateData(uuid, req.body);
        return res.status(201).json({
          msg: "Success",
          data: product.rows,
        });
      }

      // Jika hanya img product yang terisi
      if (file) {
        const { result, error } = await cloudinaryUploader(
          req,
          "productimg",
          uuid as string
        );
        console.log(result);
        if (error) throw error;
        if (!result) throw new Error("Upload gagal");
        const imgProduct = await updateData(uuid, body, result.secure_url);
        return res.status(201).json({
          msg: "Success",
          data: imgProduct.rows,
        });
      }
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (err: unknown) {
    let errorMessage = "Internal Server Error";
    if (err instanceof Error) {
      errorMessage = err.message;
      if (
        errorMessage.includes(
          'duplicate key value violates unique constraint "product_name"'
        )
      ) {
        errorMessage = "Product name already exists";
        return res.status(400).json({
          msg: "Error",
          err: errorMessage,
        });
      }
      if (
        errorMessage.includes(
          'null value in column "product_name" of relation "categories" violates not-null constraint'
        )
      ) {
        errorMessage = "Product name cannot be null";
        return res.status(400).json({
          msg: "Error",
          err: errorMessage,
        });
      }
      return res.status(500).json({
        msg: "Error",
        err: "Internal Server Error",
      });
    }
  }
};
