import { checkIfPaymentMethodExists, createData, getAllData, updateData } from "../../repository/transactions/payment.repository";
import { Request, Response } from "express-serve-static-core";

export const create = async (req: Request, res: Response) => {
    try{
        const result = await createData(req.body);
        return res.status(200).json({
            msg: "succes",
            data: result.rows,
        });
    }catch (err: unknown) {
        let errorMessage = "Internal Server Error";
        if (err instanceof Error) {
            errorMessage = err.message;
            if (errorMessage.includes('null value in column "payment_method" of relation "payments" violates not-null constraint')) {
                errorMessage = "payment method cannot be null";
                return res.status(400).json({
                    msg: "Error",
                    err: errorMessage,
                });
            } else if (errorMessage.includes('duplicate key value violates unique constraint "unique_payment_method"')) {
                errorMessage = "Duplicate payment method name";
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

export const FetchAll = async (req: Request, res: Response) => {
    try{
        const result = await getAllData();
        return res.status(200).json({
            msg: "succes",
            data: result.rows,
        });
    }catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message);
              }
              return res.status(500).json({
                msg: "Error",
                err: "Internal Server Error",
              });
    }
};

export const update = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const PaymentMethod = await checkIfPaymentMethodExists(id);
        if (!PaymentMethod) {
            return res.status(404).json({
                msg: "ID payment method tidak ditemukan",
            });
        }
        const result = await updateData(id, req.body);
        return res.status(200).json({
            msg: "succes",
            data: result.rows,
        });
    } catch (err: unknown) {
        let errorMessage = "Internal Server Error";
        if (err instanceof Error) {
            errorMessage = err.message;
            if (errorMessage.includes('duplicate key value violates unique constraint "unique_payment_method"')) {
                errorMessage = "Payment methods are the same, no need to change";
                return res.status(400).json({
                    msg: "Error",
                    err: errorMessage,
                });
            }
        }
        return res.status(500).json({
            msg: "Error",
            err: "Internal Server Error",
        });
    } 
};