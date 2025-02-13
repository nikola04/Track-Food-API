import { OAuth2Client, TokenPayload } from "google-auth-library";

const client = new OAuth2Client();

export enum VerificationError {
  InvalidToken = "INVALID_TOKEN",
  NoPayload = "NO_PAYLOAD",
}

export const verifyIDToken = async (token: string): Promise<{ userId: string, payload: TokenPayload }> => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: [
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_IOS_CLIENT_ID,
        ],
    }).catch((err) => null);

    if (!ticket) throw VerificationError.InvalidToken;
    const payload = ticket.getPayload();
    if (!payload) throw VerificationError.NoPayload;

    const userId = payload["sub"];
    return ({ userId, payload });
};
