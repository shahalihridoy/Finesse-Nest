import { Injectable } from "@nestjs/common";
import { and, eq, sql } from "drizzle-orm";
import { DatabaseService } from "../../database/database.service";
import { menuMainSliders, menus } from "../../database/schema";

@Injectable()
export class MenuService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Get all menus - maintains exact same logic as original allMenus
   */
  async getAllMenus() {
    const db = this.db.getDb();

    const menus = await db.query.menus.findMany({
      with: {
        groups: {
          with: {
            categories: true
          }
        }
      }
    });

    return {
      success: true,
      menus: menus
    };
  }

  /**
   * Get menu front sliders - maintains exact same logic as original allMenuFrontSliders
   */
  async getMenuFrontSliders(menuName: string) {
    const db = this.db.getDb();

    // Find menu by name
    const menu = await db.query.menus.findFirst({
      where: eq(menus.name, menuName)
    });

    if (!menu) {
      return {
        success: false,
        message: "Menu not found",
        sliders: []
      };
    }

    const sliders = await db.query.menuMainSliders.findMany({
      where: and(
        eq(menuMainSliders.menuId, menu.id),
        eq(menuMainSliders.isActive, true)
      ),
      orderBy: [sql`order ASC`]
    });

    return {
      success: true,
      sliders: sliders
    };
  }
}
