import { Schema } from "mongoose";

export type Provider = 'google'//|'facebook'|'apple'|'local'
// Local should save hashed passwords in separate collection maybe?

export interface Account {
    user_id: Schema.Types.ObjectId,
    provider: Provider,
    provider_account_id: string,
    created_at: Date
}