import express from 'express';
import mongoose from "mongoose";
import { WatchForNewLabels } from "./services/watchMailBox";
import { notificationsRouter } from "./routes/notificationRoutes";
import dotenv from "dotenv";
dotenv.config();


const app = express();
const port = 7000;
const mongodbUrl: string = "mongodb://127.0.0.1:27017/gmail-api-project"


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/gmail", notificationsRouter)


mongoose.connect(mongodbUrl).then(() => console.log("Connected to database"))


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

const refreshToken = "Enter_Your_Refresh_Token";

new WatchForNewLabels().executeWatch(refreshToken);
