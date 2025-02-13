import { Router } from "express";
import cookieParser from "cookie-parser";
import google from "./providers/google";
import refresh from './refresh'
import bodyParser from "body-parser";

const router = Router();
router.use(cookieParser());
router.use(bodyParser.json());

router.use("/providers/google", google);
router.use("/refresh", refresh);

export default router;
