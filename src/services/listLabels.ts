import { google } from "googleapis";
import { WatchedMailBoxes } from "../schema/watchmailboxSchema"
import dotenv from "dotenv";
dotenv.config();


const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const { OAuth2 } = google.auth;
const oAuth2Client = new OAuth2({ clientId, clientSecret });



const gmail = google.gmail({ version: 'v1' });

export class ListAllLabels {
    public async listLabels(refreshToken: string): Promise<Record<string,any>> {

        oAuth2Client.setCredentials({
            refresh_token: refreshToken
        });

        let serverResponse = await gmail.users.labels.list({
            auth: oAuth2Client,
            userId: 'me'
        })


        let labelIds: string[] = [];
        let labelNames: string[] = [];

        let data: Record<string, any>[] = []

        if (serverResponse.data.labels) {
            data = serverResponse.data.labels;
        }

        for (const label of data) {
            labelIds.push(label.id)
            labelNames.push(label.name)
        }

        let result = {
            labelIds: labelIds,
            labelNames: labelNames
        }

        return result;
            



    }
}
