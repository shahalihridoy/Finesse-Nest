import { Injectable } from "@nestjs/common";
import { and, desc, eq, sql } from "drizzle-orm";
import { DatabaseService } from "../../database/database.service";
import { notifications } from "../../database/schema";

@Injectable()
export class NotificationsService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Get notification count - maintains exact same logic as original getNotiCount
   */
  async getNotificationCount(userId: number) {
    const db = this.db.getDb();

    const countResult = await db
      .select({ total: sql<number>`COUNT(id)` })
      .from(notifications)
      .where(
        and(eq(notifications.userId, userId), eq(notifications.seen, false))
      );

    const count = countResult[0]?.total || 0;

    return {
      success: true,
      notiCount: count
    };
  }

  /**
   * Get notification details - maintains exact same logic as original getNotiDetails
   */
  async getNotificationDetails(userId: number, limit?: number) {
    const db = this.db.getDb();

    const notificationsList = await db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: [desc(notifications.id)],
      limit: limit
    });

    return {
      success: true,
      notiDetails: notificationsList
    };
  }

  /**
   * Update notification - maintains exact same logic as original updateNoti
   */
  async updateNotification(userId: number, notificationId: number) {
    const db = this.db.getDb();

    await db
      .update(notifications)
      .set({ seen: true })
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.id, notificationId)
        )
      );

    const updatedNotifications = await db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: [desc(notifications.id)],
      limit: 10
    });

    return {
      success: true,
      data: updatedNotifications
    };
  }

  /**
   * Update all notifications - maintains exact same logic as original updateAllNoti
   */
  async updateAllNotifications(userId: number) {
    const db = this.db.getDb();

    await db
      .update(notifications)
      .set({ seen: true })
      .where(eq(notifications.userId, userId));

    const updatedNotifications = await db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: [desc(notifications.id)],
      limit: 10
    });

    return {
      success: true,
      data: updatedNotifications
    };
  }

  /**
   * Delete notification - maintains exact same logic as original deleteNoti
   */
  async deleteNotification(userId: number, notificationId: number) {
    const db = this.db.getDb();

    await db
      .delete(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.id, notificationId)
        )
      );

    const remainingNotifications = await db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      limit: 10
    });

    return {
      success: true,
      data: remainingNotifications
    };
  }

  /**
   * Create notification - helper method for creating notifications
   */
  async createNotification(notificationData: {
    userId: number;
    orderId?: number;
    title: string;
    message: string;
    type: string;
  }) {
    const db = this.db.getDb();

    const [newNotification] = await db
      .insert(notifications)
      .values({
        userId: notificationData.userId,
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type,
        seen: false
      })
      .returning();

    return newNotification;
  }

  /**
   * Get notifications with pagination
   */
  async getNotificationsWithPagination(
    userId: number,
    page: number = 1,
    limit: number = 10
  ) {
    const db = this.db.getDb();
    const offset = (page - 1) * limit;

    const notificationsList = await db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: [desc(notifications.id)],
      limit: limit,
      offset: offset
    });

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(eq(notifications.userId, userId));

    return {
      success: true,
      notifications: {
        data: notificationsList,
        pagination: {
          page: page,
          limit: limit,
          total: totalCount[0]?.count || 0,
          totalPages: Math.ceil((totalCount[0]?.count || 0) / limit)
        }
      }
    };
  }
}
