import { Router } from "express";
import { singleCloudUploader } from "../middleware/upload";
import { FetchDetail, Update } from "../handlers/auth/profile.handlers";
import { authorization } from "../middleware/authorization.middleware";

export const profileRouter = Router();

profileRouter.patch("/setting/:id", singleCloudUploader("profile") ,authorization(['admin', 'user']), Update )
profileRouter.get("/:id", FetchDetail)