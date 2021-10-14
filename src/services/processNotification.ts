import { Request, Response } from "express";
import { google } from "googleapis";
import { WatchedMailBoxes } from "../schema/watchmailboxSchema";
import { WatchMailBoxDoc } from "../models/watchmailboxModel";
import { ListAllLabels } from "./listLabels";


import dotenv from "dotenv";
dotenv.config();

const { OAuth2 } = google.auth;
let clientId = process.env.CLIENT_ID;
let clientSecret = process.env.CLIENT_SECRET;
const oAuth2Client = new OAuth2({ clientId, clientSecret });
const gmail = google.gmail({ version: 'v1' });


export class PubSubNotificationsReceiver {
    public async receive(req: Request, res: Response) {
        try {
            console.log("i got here: PubSubReceiver");

            if (!req.body.message) {
                return res.status(500).send({ error: 'Invalid POST data received' });
            }

            let notification: string = req.body.message.data;

            await this.processNotification(notification);

            return res.status(200).send({ success: true });

        } catch (error) {
            console.error(error)
        }
    }

    private async processNotification(notification: string) {
        try {

            let decodedNotification = Buffer.from(notification, 'base64').toString('ascii');

            console.log("decoded-notification ~ ", decodedNotification);

            let dbData = await WatchedMailBoxes.find({});

            let data = dbData[0];

            let { startHistoryId, refreshToken } = data;

            await this.getMessageHistory(refreshToken, startHistoryId, data);

        } catch (error) {
            console.log(error)
        }


    }

    private async getMessageHistory(refreshToken: string, startHistoryId: string, dbData: WatchMailBoxDoc) {
        try {

            oAuth2Client.setCredentials({
                refresh_token: refreshToken
            });

            let serverResponse = await gmail.users.history.list({
                auth: oAuth2Client,
                historyTypes: ["labelAdded"],
                userId: "me",
                startHistoryId: startHistoryId

            });

            console.log("historyList =>> ", serverResponse.data);

            let historyId = serverResponse.data.historyId!;

            let currentLabels = await new ListAllLabels().listLabels(refreshToken);

            let previousLabels = dbData.existingLabels;

            let newLabel = currentLabels.filter(label => !previousLabels.includes(label));

            console.log("the new label ", newLabel);

            //updating the startHistoryId with the historyId from notification
            dbData.startHistoryId = historyId;
            dbData.existingLabels = currentLabels;

            await dbData.save();

        } catch (error) {
            console.log(error)
        }

    }




}