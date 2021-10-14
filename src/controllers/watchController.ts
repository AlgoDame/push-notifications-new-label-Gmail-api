import { NextFunction, Request, Response, Router } from "express";
import { PubSubNotificationsReceiver } from "../services/processNotification";
/**
 * / route
 *
 * @class NotificationsController
 */
export class NotificationsController {
    /**
     * Create the routes.
     *
     * @method loadRoutes
     */
    public loadRoutes(prefix: string, router: Router) {
        this.initProcessNotification(prefix, router);
    }

    private initProcessNotification(prefix: String, router: Router): any {
        router.post(prefix + "", (req, res: Response, next: NextFunction) => {
            new PubSubNotificationsReceiver().receive(req, res);
        })
    }


}