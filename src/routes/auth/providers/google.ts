import { Request, Response, Router } from "express";
import bodyParser from "body-parser";
import { verifyIDToken } from "@/utils/googleAuth";

const router = Router();
router.use(bodyParser.json());

router.post("/", async (req: Request, res: Response) => {
  try {
    const token = req.body.idToken;
    const userID = await verifyIDToken(token);

    res.json({ status: "OK" });
  } catch (err) {
    console.error(err);
    res.status(401).json({ status: "ERROR", error: err });
  }
});

export default router;
