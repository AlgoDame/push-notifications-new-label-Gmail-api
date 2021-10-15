import { google } from "googleapis";
import { ListAllLabels } from "./listLabels";
import { WatchedMailBoxes } from "../schema/watchmailboxSchema";
import dotenv from "dotenv";
import { WatchMailBoxDoc } from "../models/watchmailboxModel";
dotenv.config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const googlePubSubtopicName = process.env.GOOGLE_PUB_SUB_TOPIC;

const { OAuth2 } = google.auth;
const oAuth2Client = new OAuth2({ clientId, clientSecret });

const gmail = google.gmail({ version: "v1" });

export class WatchForNewLabels {
    public async executeWatch(refreshToken: string) {
        try {
            oAuth2Client.setCredentials({
                refresh_token: refreshToken,
            });

            let labels = await new ListAllLabels().listLabels(refreshToken);

            console.log("labels: ", labels);

            const serverResponse = await gmail.users.watch({
                userId: "me",
                auth: oAuth2Client,
                requestBody: {
                    labelIds: labels,
                    labelFilterAction: "exclude",
                    topicName: googlePubSubtopicName,
                },
            });

            let startHistoryId = serverResponse.data.historyId!;

            console.log("startHistoryId ~ ", startHistoryId);

            let dbData = await WatchedMailBoxes.find({});

            if(dbData.length === 0){
                let data = WatchedMailBoxes.build({
                    refreshToken: refreshToken,
                    startHistoryId: startHistoryId,
                    existingLabels: labels

                })
                
                data = await data.save();
                console.log("data -> ", data)
                return;
            }

            let data:WatchMailBoxDoc = dbData[0];

            data.startHistoryId = startHistoryId;
            
            await data.save();



        } catch (error) {
            console.error(error);
        }
    }
}
