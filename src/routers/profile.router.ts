import { Router } from "express";
import { singleCloudUploader } from "../middleware/upload";
import { authorization } from "../middleware/authorization.middleware";
import { FetchDetail, update } from "../handlers/auth/profile.handlers";

export const profileRouter = Router();

profileRouter.patch("/setting/:id",authorization(),singleCloudUploader("profile"), update )
profileRouter.get("/profile/:id",authorization(), FetchDetail)