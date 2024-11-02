import { Router } from "express";
import { create, FetchAll, update } from "../handlers/transactions/shipping.handler";
import { authorization } from "../middleware/authorization.middleware";

export const shippingRouter = Router();

shippingRouter.post("/add",create);
shippingRouter.get("/",authorization(['admin']), FetchAll);
shippingRouter.patch("/setting/:id",authorization(['admin']), update);