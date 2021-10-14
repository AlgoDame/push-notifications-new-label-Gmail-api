import mongoose from 'mongoose'
import { IWatchMailbox } from '../interfaces/iwatchmailbox';

export interface WatchMailBoxModel extends mongoose.Model<WatchMailBoxDoc> {
    build(attr?: IWatchMailbox): WatchMailBoxDoc
}

export interface WatchMailBoxDoc extends mongoose.Document {
    refreshToken: string,
    startHistoryId: string,
    existingLabels: string[]
    
}
