import mongoose from "mongoose";
import { IWatchMailbox } from "../interfaces/iwatchmailbox";
import { WatchMailBoxDoc, WatchMailBoxModel } from "../models/watchmailboxModel";

export const watchMailBoxSchema = new mongoose.Schema({
    refreshToken: {type: String},
    startHistoryId: {type: String},
    existingLabels: {type: [String]},
    existingLabelNames: {type: [String]}

}, {
    timestamps: true,
    collection: 'watchedmailboxes'
});

watchMailBoxSchema.statics.build = (attr: IWatchMailbox) => {
    return new WatchedMailBoxes(attr);
}

const WatchedMailBoxes = mongoose.model<WatchMailBoxDoc , WatchMailBoxModel>('watchedmailboxes', watchMailBoxSchema)
export { WatchedMailBoxes }

