import { model, Schema } from "mongoose";
import { Account } from "./account.types";

const accountSchema = new Schema<Account>({
    user_id: { type: Schema.Types.ObjectId, required: true },
    provider: { type: String, required: true },
    provider_account_id: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
})

export const AccountModel = model<Account>("accounts", accountSchema);