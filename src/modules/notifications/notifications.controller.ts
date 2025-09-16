import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Request,
  UseGuards
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { NotificationsService } from "./notifications.service";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("count")
  async getNotificationCount(@Request() req) {
    return this.notificationsService.getNotificationCount(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get()
  async getNotificationDetails(
    @Request() req,
    @Query("limit") limit?: number,
    @Query("page") page?: number
  ) {
    if (page) {
      return this.notificationsService.getNotificationsWithPagination(
        req.user.id,
        parseInt(page.toString()),
        limit ? parseInt(limit.toString()) : 10
      );
    }
    return this.notificationsService.getNotificationDetails(
      req.user.id,
      limit ? parseInt(limit.toString()) : undefined
    );
  }

  @UseGuards(AuthGuard("jwt"))
  @Post(":id/update")
  async updateNotification(
    @Request() req,
    @Param("id", ParseUUIDPipe) notificationId: string
  ) {
    return this.notificationsService.updateNotification(
      req.user.id,
      notificationId
    );
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("update-all")
  async updateAllNotifications(@Request() req) {
    return this.notificationsService.updateAllNotifications(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  async deleteNotification(
    @Request() req,
    @Param("id", ParseUUIDPipe) notificationId: string
  ) {
    return this.notificationsService.deleteNotification(
      req.user.id,
      notificationId
    );
  }
}
