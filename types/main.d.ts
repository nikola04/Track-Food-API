declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        PORT: number;
        MONGODB_URI: string;
        GOOGLE_IOS_CLIENT_ID: string;
        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
    }
}