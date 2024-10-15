import { Router } from "express";
import { singleCloudUploader } from "../middleware/upload";
import { FetchDetail } from "../handlers/auth/profile.handlers";
import { authorization } from "../middleware/authorization.middleware";

export const profileRouter = Router();

/* profileRouter.patch("/setting/:id",authorization('USER'), singleCloudUploader("profile") , update ) */
profileRouter.get("/:id", FetchDetail)