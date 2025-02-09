import { Router } from "express";
import cookieParser from "cookie-parser";
import google from "./providers/google";

const router = Router();
router.use(cookieParser());

router.use("/providers/google", google);

export default router;
