import express from 'express';
import { NotificationsController } from '../controllers/watchController';

const router = express.Router();

new NotificationsController().loadRoutes("/push", router);

export { router as notificationsRouter };
