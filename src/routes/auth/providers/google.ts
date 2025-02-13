import { Request, Response, Router } from "express";
import bodyParser from "body-parser";
import { verifyIDToken } from "@/utils/googleAuth";
import { AccountModel } from "@/models/account.model";
import { UserModel } from "@/models/user.model";
import { Account } from "@/models/account.types";
import { generateTokens } from "@/utils/tokens";
import { TokenModel } from "@/models/token.model";

const router = Router();
router.use(bodyParser.json());

router.post("/", async (req: Request, res: Response) => {
  try {
    const googleToken = req.body.idToken;
    const { userId: googleId, payload } = await verifyIDToken(googleToken);
    let account: Account|null = await AccountModel.findOne({ provider: 'google', provider_account_id: googleId }).lean();
    if(!account) { // create new account
        if(!payload.email_verified) return res.status(403).json({ status: 'ERORR', error: 'Provider email is not verified' });
        const existingEmail = await UserModel.findOne({ email: payload.email });
        if(existingEmail) return res.status(403).json({ status: 'ERORR', error: 'Email already registered but your account is not connected. Please, try another way to login.' });
        const user = await UserModel.create({
            email: payload.email,
            name: payload.name,
        });
        account = await AccountModel.create({
            provider: 'google',
            provider_account_id: googleId,
            user_id: user._id,
        })
    }
    const { accessToken, refreshToken, hashedToken, refreshExpiry } = generateTokens(String(account.user_id).toString());
    const userAgent = 'IOS_APP'
    await TokenModel.create({ user_id: account.user_id, hashed_token: hashedToken, user_agent: userAgent, expires_at: refreshExpiry });
    res.json({ status: "OK", access_token: accessToken, refresh_token: refreshToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ status: "ERROR", error: err });
  }
});

export default router;
