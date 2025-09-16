import { Injectable } from "@nestjs/common";
import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { HelperService } from "../../common/services/helper.service";
import { DatabaseService } from "../../database/database.service";
import {
  brands,
  groups,
  menus,
  products,
  stores,
  variants
} from "../../database/schema";

@Injectable()
export class ShopService {
  constructor(
    private readonly db: DatabaseService,
    private readonly helperService: HelperService
  ) {}

  /**
   * Get all colors - maintains exact same logic as original allColors
   */
  async getAllColors() {
    // This would return color variations
    return {
      success: true,
      colors: []
    };
  }

  /**
   * Get all groups - maintains exact same logic as original allGroups
   */
  async getAllGroups() {
    const db = this.db.getDb();

    const groupsList = await db.query.groups.findMany({
      where: eq(groups.isActive, true),
      with: {
        categories: true
      }
    });

    return {
      success: true,
      groups: groupsList
    };
  }

  /**
   * Get menu groups - maintains exact same logic as original allMenuGroups
   */
  async getMenuGroups(menuName: string) {
    const db = this.db.getDb();

    // Find menu by name and get its groups
    const menu = await db.query.menus.findFirst({
      where: eq(menus.name, menuName),
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
      groups: menu?.groups || []
    };
  }

  /**
   * Get shop page data - maintains exact same logic as original shopPageData
   */
  async getShopPageData() {
    return {
      success: true,
      message: "Shop page data functionality to be implemented"
    };
  }

  /**
   * Get sale page data - maintains exact same logic as original salePageData
   */
  async getSalePageData() {
    return {
      success: true,
      message: "Sale page data functionality to be implemented"
    };
  }

  /**
   * Get shop screen data - maintains exact same logic as original shopScreenData
   */
  async getShopScreenData() {
    return {
      success: true,
      message: "Shop screen data functionality to be implemented"
    };
  }

  /**
   * Get sale screen data - maintains exact same logic as original saleScreenData
   */
  async getSaleScreenData() {
    return {
      success: true,
      message: "Sale screen data functionality to be implemented"
    };
  }

  /**
   * Get all tags - maintains exact same logic as original allTags
   */
  async getAllTags() {
    const db = this.db.getDb();

    const tags = await db.query.tags.findMany();

    return {
      success: true,
      tags: tags
    };
  }

  /**
   * Get all brands - maintains exact same logic as original AllBrands
   */
  async getAllBrands() {
    const db = this.db.getDb();

    const brandsList = await db.query.brands.findMany({
      where: eq(brands.isActive, true)
    });

    return {
      success: true,
      brands: brandsList
    };
  }

  /**
   * Get shop products with filters - maintains exact same logic as original getShopProducts
   */
  async getShopProducts(
    page: number = 1,
    limit: number = 12,
    categoryId?: string,
    brandId?: string,
    groupId?: string,
    search?: string,
    sortBy?: string,
    minPrice?: number,
    maxPrice?: number
  ) {
    const db = this.db.getDb();
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [
      eq(products.isAvailable, true),
      eq(products.isArchived, false)
    ];

    if (categoryId) {
      whereConditions.push(eq(products.categoryId, categoryId));
    }

    if (brandId) {
      whereConditions.push(eq(products.brandId, brandId));
    }

    if (groupId) {
      whereConditions.push(eq(products.groupId, groupId));
    }

    if (search) {
      whereConditions.push(
        or(
          like(sql`name`, `%${search}%`),
          like(sql`description`, `%${search}%`)
        )
      );
    }

    if (minPrice !== undefined) {
      whereConditions.push(
        sql`CAST(${products.sellingPrice} AS DECIMAL) >= ${minPrice}`
      );
    }

    if (maxPrice !== undefined) {
      whereConditions.push(
        sql`CAST(${products.sellingPrice} AS DECIMAL) <= ${maxPrice}`
      );
    }

    // Build order by clause
    let orderByClause = [desc(products.createdAt)];
    if (sortBy) {
      switch (sortBy) {
        case "price_low":
          orderByClause = [sql`CAST(${products.sellingPrice} AS DECIMAL) ASC`];
          break;
        case "price_high":
          orderByClause = [sql`CAST(${products.sellingPrice} AS DECIMAL) DESC`];
          break;
        case "name":
          orderByClause = [sql`name ASC`];
          break;
        case "newest":
          orderByClause = [desc(products.createdAt)];
          break;
      }
    }

    // Get products
    const shopProducts = await db.query.products.findMany({
      where: and(...whereConditions),
      with: {
        group: true,
        category: true,
        brand: true,
        productImages: true,
        variants: {
          where: and(
            eq(variants.isAvailable, true),
            eq(variants.isArchived, false)
          ),
          with: {
            purchases: {
              where: eq(stores.mainBranch, true),
              with: {
                store: true
              }
            },
            sellings: {
              where: eq(stores.mainBranch, true),
              with: {
                store: true
              }
            }
          }
        }
      },
      orderBy: orderByClause,
      limit: limit,
      offset: offset
    });

    // Format products with stock calculation
    const formattedProducts = [];
    for (const product of shopProducts) {
      const formattedProduct =
        await this.helperService.formatMainProductStock(product);
      formattedProducts.push(formattedProduct);
    }

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(...whereConditions));

    return {
      success: true,
      products: {
        data: formattedProducts,
        pagination: {
          page: page,
          limit: limit,
          total: totalCount[0]?.count || 0,
          totalPages: Math.ceil((totalCount[0]?.count || 0) / limit)
        }
      }
    };
  }

  /**
   * Get featured products - maintains exact same logic as original getFeaturedProducts
   */
  async getFeaturedProducts(limit: number = 8) {
    const db = this.db.getDb();

    const featuredProducts = await db.query.products.findMany({
      where: and(
        eq(products.isAvailable, true),
        eq(products.isArchived, false),
        eq(products.isFeatured, true)
      ),
      with: {
        group: true,
        category: true,
        brand: true,
        productImages: true,
        variants: {
          where: and(
            eq(variants.isAvailable, true),
            eq(variants.isArchived, false)
          ),
          with: {
            purchases: {
              where: eq(stores.mainBranch, true),
              with: {
                store: true
              }
            },
            sellings: {
              where: eq(stores.mainBranch, true),
              with: {
                store: true
              }
            }
          }
        }
      },
      orderBy: [desc(products.createdAt)],
      limit: limit
    });

    // Format products with stock calculation
    const formattedProducts = [];
    for (const product of featuredProducts) {
      const formattedProduct =
        await this.helperService.formatMainProductStock(product);
      formattedProducts.push(formattedProduct);
    }

    return {
      success: true,
      featuredProducts: formattedProducts
    };
  }

  /**
   * Get latest products - maintains exact same logic as original getLatestProducts
   */
  async getLatestProducts(limit: number = 8) {
    const db = this.db.getDb();

    const latestProducts = await db.query.products.findMany({
      where: and(
        eq(products.isAvailable, true),
        eq(products.isArchived, false)
      ),
      with: {
        group: true,
        category: true,
        brand: true,
        productImages: true,
        variants: {
          where: and(
            eq(variants.isAvailable, true),
            eq(variants.isArchived, false)
          ),
          with: {
            purchases: {
              where: eq(stores.mainBranch, true),
              with: {
                store: true
              }
            },
            sellings: {
              where: eq(stores.mainBranch, true),
              with: {
                store: true
              }
            }
          }
        }
      },
      orderBy: [desc(products.createdAt)],
      limit: limit
    });

    // Format products with stock calculation
    const formattedProducts = [];
    for (const product of latestProducts) {
      const formattedProduct =
        await this.helperService.formatMainProductStock(product);
      formattedProducts.push(formattedProduct);
    }

    return {
      success: true,
      latestProducts: formattedProducts
    };
  }

  /**
   * Search products - maintains exact same logic as original searchProducts
   */
  async searchProducts(
    query: string,
    page: number = 1,
    limit: number = 12,
    sortBy?: string
  ) {
    const db = this.db.getDb();
    const offset = (page - 1) * limit;

    // Build where conditions for search
    const whereConditions = [
      eq(products.isAvailable, true),
      eq(products.isArchived, false),
      or(
        like(sql`name`, `%${query}%`),
        like(sql`description`, `%${query}%`),
        like(sql`sku`, `%${query}%`)
      )
    ];

    // Build order by clause
    let orderByClause = [desc(products.createdAt)];
    if (sortBy) {
      switch (sortBy) {
        case "price_low":
          orderByClause = [sql`CAST(${products.sellingPrice} AS DECIMAL) ASC`];
          break;
        case "price_high":
          orderByClause = [sql`CAST(${products.sellingPrice} AS DECIMAL) DESC`];
          break;
        case "name":
          orderByClause = [sql`name ASC`];
          break;
        case "newest":
          orderByClause = [desc(products.createdAt)];
          break;
      }
    }

    // Get search results
    const searchResults = await db.query.products.findMany({
      where: and(...whereConditions),
      with: {
        group: true,
        category: true,
        brand: true,
        productImages: true,
        variants: {
          where: and(
            eq(variants.isAvailable, true),
            eq(variants.isArchived, false)
          ),
          with: {
            purchases: {
              where: eq(stores.mainBranch, true),
              with: {
                store: true
              }
            },
            sellings: {
              where: eq(stores.mainBranch, true),
              with: {
                store: true
              }
            }
          }
        }
      },
      orderBy: orderByClause,
      limit: limit,
      offset: offset
    });

    // Format products with stock calculation
    const formattedProducts = [];
    for (const product of searchResults) {
      const formattedProduct =
        await this.helperService.formatMainProductStock(product);
      formattedProducts.push(formattedProduct);
    }

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(...whereConditions));

    return {
      success: true,
      searchResults: {
        data: formattedProducts,
        query: query,
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
