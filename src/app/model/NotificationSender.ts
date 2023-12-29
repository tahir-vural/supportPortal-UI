import { NotificationType } from "../enum/notification-type.enum";
import { NotificationService } from "../service/notification.service";

export class NotificationSender{
    constructor(private notificationService:NotificationService){
    }
     // Send notification
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, "An error occured. Please try again.");
    }
  }
}