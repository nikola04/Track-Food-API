import authHandler, { config } from "@/utils/auth";

export const generateTokens = (userId: string) => {
    const accessToken = authHandler.generateAccessToken(userId);
    const { jwt: refreshToken, hashedToken } = authHandler.generateRefreshToken();
    const refreshExpiry = new Date(Date.now() + config.refresh_token.expiry * 1000);
    return ({ accessToken, refreshToken, hashedToken, refreshExpiry });
}