import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { and, eq, sql } from "drizzle-orm";
import { HelperService } from "../../common/services/helper.service";
import { DatabaseService } from "../../database/database.service";
import {
  bonuses,
  customers,
  notifications,
  orders,
  paymentSheets,
  users
} from "../../database/schema";

@Injectable()
export class UsersService {
  constructor(
    private readonly db: DatabaseService,
    private readonly helperService: HelperService
  ) {}

  /**
   * Get user by ID - maintains exact same logic as original
   */
  async findById(id: string) {
    const db = this.db.getDb();

    return db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        customer: true
      }
    });
  }

  /**
   * Get user by contact - maintains exact same logic as original
   */
  async findByContact(contact: string) {
    const db = this.db.getDb();

    return db.query.users.findFirst({
      where: eq(users.contact, contact),
      with: {
        customer: true
      }
    });
  }

  /**
   * Update user - maintains exact same logic as original updateUser method
   */
  async updateUser(userId: string, updateData: any) {
    const db = this.db.getDb();

    const { customer, password, ...userData } = updateData;

    // Handle password update - exact same logic as original
    if (password) {
      const currentUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { password: true }
      });

      const isOldPasswordValid = await bcrypt.compare(
        password.oldPassword,
        currentUser.password
      );
      if (!isOldPasswordValid) {
        throw new BadRequestException("Old password is incorrect.");
      }

      userData.password = await bcrypt.hash(password.password, 10);
    }

    // Update user
    await db.update(users).set(userData).where(eq(users.id, userId));

    // Update customer if provided
    if (customer) {
      await db
        .update(customers)
        .set(customer)
        .where(eq(customers.id, customer.id));
    }

    return {
      success: true,
      message: "Profile Updated Successfully!"
    };
  }

  /**
   * Update user password - maintains exact same logic as original
   */
  async updatePassword(userId: string, newPassword: string) {
    const db = this.db.getDb();

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));

    return {
      success: true,
      message: "Password update successfully!"
    };
  }

  /**
   * Get customer data - maintains exact same logic as original
   */
  async getCustomers() {
    const db = this.db.getDb();

    return db.query.customers.findMany({
      where: sql`id != 1` // Exclude default customer
    });
  }

  /**
   * Get user balance details - maintains exact same logic as original
   */
  async getUserBalanceDetails(userId: string) {
    const db = this.db.getDb();

    const customer = await db.query.customers.findFirst({
      where: eq(customers.userId, userId)
    });

    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    // Get bonus total - exact same logic as original
    const bonusResult = await db
      .select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
      .from(bonuses)
      .where(eq(bonuses.customerId, customer.id));

    const bonusTotal = bonusResult[0]?.total || 0;

    // Get outstanding amount - exact same logic as original
    const outstandingResult = await db
      .select({ total_due: sql<number>`SUM(amount)` })
      .from(paymentSheets)
      .where(
        and(
          sql`type IN ('due', 'opening', 'dueincoming')`,
          eq(paymentSheets.paymentFor, "customer"),
          eq(paymentSheets.uid, customer.id)
        )
      )
      .groupBy(paymentSheets.uid);

    const outstanding = outstandingResult[0]?.total_due || 0;

    // Get total order amount - exact same logic as original
    const totalOrderResult = await db
      .select({ total: sql<number>`COALESCE(SUM(grand_total), 0)` })
      .from(orders)
      .where(eq(orders.userId, userId));

    const totalOrderAmount = totalOrderResult[0]?.total || 0;

    // Get total paid amount - exact same logic as original
    const totalPaidResult = await db
      .select({ total: sql<number>`COALESCE(SUM(grand_total), 0)` })
      .from(orders)
      .where(and(eq(orders.userId, userId), eq(orders.paymentStatus, "Paid")));

    const totalPaidAmount = totalPaidResult[0]?.total || 0;

    return {
      success: true,
      balance: bonusTotal,
      totalOrderAmount,
      totalPaidAmount,
      outstanding
    };
  }

  /**
   * Get outstanding customer - maintains exact same logic as original
   */
  async getOutstandingCustomer(userId: string) {
    const db = this.db.getDb();

    let customer = await db.query.customers.findFirst({
      where: eq(customers.userId, userId)
    });

    // Create customer if doesn't exist - exact same logic as original
    if (!customer) {
      const user = await this.findById(userId);
      const [newCustomer] = await db
        .insert(customers)
        .values({
          userId: userId,
          customerName: user.name,
          contact: user.contact,
          email: user.email
        })
        .returning();
      customer = newCustomer;
    }

    // Get bonus total - exact same logic as original
    const bonusResult = await db
      .select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
      .from(bonuses)
      .where(eq(bonuses.customerId, customer.id));

    const bonusTotal = bonusResult[0]?.total || 0;

    return {
      success: true,
      bonus: { total: bonusTotal }
    };
  }

  /**
   * Get notification count - maintains exact same logic as original
   */
  async getNotificationCount(userId: string) {
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
   * Get notification details - maintains exact same logic as original
   */
  async getNotificationDetails(userId: string, limit?: number) {
    const db = this.db.getDb();

    const notificationsList = await db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: (notifications, { desc }) => [desc(notifications.id)],
      limit: limit
    });

    return {
      success: true,
      notiDetails: notificationsList
    };
  }

  /**
   * Update notification - maintains exact same logic as original
   */
  async updateNotification(userId: string, notificationId: string) {
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
      orderBy: (notifications, { desc }) => [desc(notifications.id)],
      limit: 10
    });

    return {
      success: true,
      data: updatedNotifications
    };
  }

  /**
   * Update all notifications - maintains exact same logic as original
   */
  async updateAllNotifications(userId: string) {
    const db = this.db.getDb();

    await db
      .update(notifications)
      .set({ seen: true })
      .where(eq(notifications.userId, userId));

    const updatedNotifications = await db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: (notifications, { desc }) => [desc(notifications.id)],
      limit: 10
    });

    return {
      success: true,
      data: updatedNotifications
    };
  }

  /**
   * Delete notification - maintains exact same logic as original
   */
  async deleteNotification(userId: string, notificationId: string) {
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
   * Get init data - maintains exact same logic as original
   */
  async getInitData(userId?: string) {
    const db = this.db.getDb();

    // Get menus with categories and subcategories - exact same logic as original
    const menus = await db.query.menus.findMany({
      with: {
        groups: {
          with: {
            categories: true
          }
        }
      }
    });

    let user = null;
    if (userId) {
      user = await this.findById(userId);

      if (user && user.customer) {
        // Format user data - exact same logic as original
        const formattedUser = {
          ...user,
          customer: {
            ...user.customer,
            city: user.customer.userCity?.name || "",
            area: user.customer.userArea?.name || ""
          }
        };

        // Remove nested objects
        delete formattedUser.customer.userCity;
        delete formattedUser.customer.userArea;

        user = formattedUser;
      }
    }

    return {
      success: true,
      user: user || false,
      menus: menus
    };
  }
}
