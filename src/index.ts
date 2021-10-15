import express from 'express';
import mongoose from "mongoose";
import { WatchForNewLabels } from "./services/watchMailBox";
import { notificationsRouter } from "./routes/notificationRoutes";
import dotenv from "dotenv";
dotenv.config();


const app = express();
const port = 5000;
const mongodbUrl: string = "mongodb://127.0.0.1:27017/gmail-api-project"


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/gmail", notificationsRouter)


mongoose.connect(mongodbUrl).then(() => console.log("Connected to database"))


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

const refreshToken = "1//03Fzc3NwzxWN_CgYIARAAGAMSNwF-L9IrMrrptT8ccSVo5b10fb0_5k4MWeMC0qbx7CkitsFrStNR-sVmRXAOCfmSwQJp2JCY2BA";

new WatchForNewLabels().executeWatch(refreshToken);
