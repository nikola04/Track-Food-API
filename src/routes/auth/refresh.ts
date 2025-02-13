import { TokenModel } from "@/models/token.model";
import { UserModel } from "@/models/user.model";
import authHandler from "@/utils/auth";
import { checkDecodeAccessToken, generateTokens } from "@/utils/tokens";
import { hashRefreshTokenData, ValidatorErrors } from "easy-token-auth";
import { Request, Response, Router } from "express";

const router = Router();

// Verify refresh token if it is still valid and NOT expired
// If refresh token is expired, delete from db and redirect to login
//
// Verify access token if it is actually valid or expired 
// If access token is invalid and not expired, delete refresh token from db and notify user
//
// Hash refresh token value
// Find token in database for refresh token value
//
// If token doesnt exist display "logged out" message and logout user
// Check if access token userId and refresh token value match
// If user id doesnt match with db one, notify user about strange login
// Check if user agent match. If agents dont match, logout user
// 
router.post('/', async (req: Request, res: Response) => {
    const accessToken = req.authorization?.access_token;
    const refreshToken = req.body.refresh_token;
    const userAgent = req.device.user_agent;
    try{
        const token = authHandler.verifyAndDecodeToken(refreshToken);
        const hashedToken = hashRefreshTokenData(token);
        const [userId, validOrExpired] = checkDecodeAccessToken(accessToken);
        const userToken = await TokenModel.findOne({ hashed_token: hashedToken });
        if(!userToken || userToken.expires_at <= new Date(Date.now())) return res.status(403).json({ status: 'ERROR', error: 'Device is logged out' }) // even if token is stollen they are old and at this point there are no needs to notify user
        if(!validOrExpired || userId == null || userId != userToken.user_id || userToken.user_agent != userAgent){ // access token is invalid, not connected to refresh token, or user agents dont match
            await TokenModel.deleteOne({ hashed_token: hashedToken });
            // ...notify user
            return res.status(403).json({ status: 'ERROR', error: 'Refresh not allowed' });
        }
        const user = await UserModel.findOne({ _id: userId });
        if(!user || user.deleted)            // dont deactivate token because of account reactivation
            return res.status(403).json({ status: 'ERROR', error: 'Account has been deleted' });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken, hashedToken: newHashedToken, refreshExpiry } = generateTokens(String(user._id).toString());
        TokenModel.deleteOne({ _id: userToken._id }); // dont wait for deletion
        TokenModel.create({ // dont wait for creation
            user_id: user._id,
            user_agent: userAgent,
            expires_at: refreshExpiry,
            hashed_token: newHashedToken
        })
        return res.json({ access_token: newAccessToken, refresh_token: newRefreshToken });
    }catch(err){
        if(err == ValidatorErrors.TokenExpired)
            return res.status(403).json({ status: 'ERROR', error: 'Refresh token expired' });
        if(err == ValidatorErrors.InvalidToken)
            return res.status(403).json({ status: 'ERROR', error: 'Invalid token' });
        return res.status(500).json({ status: 'ERROR', error: 'Internal server error' });

    }
})

export default router;