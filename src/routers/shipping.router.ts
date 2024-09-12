import { Router } from "express";
import { create, FetchAll, update } from "../handlers/transactions/shipping.handler";

export const shippingRouter = Router();

shippingRouter.post("/add",create);
shippingRouter.get("/", FetchAll);
shippingRouter.patch("/setting/:id", update);