import authHandler, { config } from "@/utils/auth";
import { ValidatorErrors } from "easy-token-auth";

export const generateTokens = (userId: string) => {
    const accessToken = authHandler.generateAccessToken(userId);
    const { jwt: refreshToken, hashedToken } = authHandler.generateRefreshToken();
    const refreshExpiry = new Date(Date.now() + config.refresh_token.expiry * 1000);
    return ({ accessToken, refreshToken, hashedToken, refreshExpiry });
}

export const checkDecodeAccessToken = (token?: string): [any|null, boolean] => {
    let data = null
    let expiredOrValid = false;
    try{
        if(!token) return [null, false];
        data = authHandler.decodeToken(token);
        authHandler.verifyAndDecodeToken(token);
        expiredOrValid = true;
    }catch(err){
        if(err == ValidatorErrors.TokenExpired) expiredOrValid = true;
    }
    return [data, expiredOrValid];
}