import { Controller } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Placeholder for notification endpoints
  // This would implement the same routes as the original notification methods
}
