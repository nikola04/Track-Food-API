import { Config, createAuthHandler, generateCredentials } from "easy-token-auth";
import cron from 'node-cron';

export const config: Config = {
    refresh_token: { expiry: 2592000 /* 30 days */ },
    access_token: { expiry: 2700 /* 45 minutes */ },
    credentials_limit: 5
}

const authHandler = createAuthHandler(config)

const credentials = generateCredentials('ES384')
authHandler.setCredentials(credentials)

cron.schedule('0 0 */7 * *' /* Every 7 days */, () => { 
    const credentials = generateCredentials('ES384')
    authHandler.setCredentials(credentials)
});


export default authHandler;