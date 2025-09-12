import { Injectable, NotFoundException } from "@nestjs/common";
import { and, desc, eq, sql } from "drizzle-orm";
import { HelperService } from "../../common/services/helper.service";
import { DatabaseService } from "../../database/database.service";
import { products, stores, wishlists } from "../../database/schema";

@Injectable()
export class WishlistService {
  constructor(
    private readonly db: DatabaseService,
    private readonly helperService: HelperService
  ) {}

  /**
   * Show user's wishlist - maintains exact same logic as original showWishList
   */
  async showWishlist(userId: number, page: number = 1, limit: number = 10) {
    const db = this.db.getDb();
    const offset = (page - 1) * limit;

    const userWishlist = await db.query.wishlists.findMany({
      where: eq(wishlists.userId, userId),
      with: {
        mainProduct: {
          with: {
            group: true,
            category: true,
            brand: true,
            productImages: true,
            products: {
              where: and(
                eq(products.isAvailable, true),
                eq(products.isArchived, false)
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
          }
        }
      },
      orderBy: [desc(wishlists.createdAt)],
      limit: limit,
      offset: offset
    });

    // Format wishlist items with stock calculation - exact same logic as original
    const formattedWishlist = [];
    for (const wishlistItem of userWishlist) {
      if (wishlistItem.mainProduct) {
        const formattedProduct =
          await this.helperService.formatMainProductStock(
            wishlistItem.mainProduct
          );
        formattedWishlist.push({
          id: wishlistItem.id,
          product: formattedProduct,
          createdAt: wishlistItem.createdAt
        });
      }
    }

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(wishlists)
      .where(eq(wishlists.userId, userId));

    return {
      success: true,
      wishlist: {
        data: formattedWishlist,
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
   * Store wishlist item - maintains exact same logic as original storeWishList
   */
  async storeWishlist(userId: number, productId: number) {
    const db = this.db.getDb();

    // Check if item already exists in wishlist
    const existingWishlistItem = await db.query.wishlists.findFirst({
      where: and(
        eq(wishlists.userId, userId),
        eq(wishlists.productId, productId)
      )
    });

    if (existingWishlistItem) {
      return {
        success: true,
        message: "Product already in wishlist",
        wishlist: existingWishlistItem
      };
    }

    // Create new wishlist item
    const [newWishlistItem] = await db
      .insert(wishlists)
      .values({
        userId: userId,
        productId: productId
      })
      .returning();

    return {
      success: true,
      message: "Product added to wishlist successfully!",
      wishlist: newWishlistItem
    };
  }

  /**
   * Update wishlist item - maintains exact same logic as original updateWishlist
   */
  async updateWishlist(userId: number, wishlistId: number, updateData: any) {
    const db = this.db.getDb();

    // Verify wishlist item belongs to user
    const wishlistItem = await db.query.wishlists.findFirst({
      where: and(eq(wishlists.id, wishlistId), eq(wishlists.userId, userId))
    });

    if (!wishlistItem) {
      throw new NotFoundException("Wishlist item not found");
    }

    // Update wishlist item
    const [updatedWishlistItem] = await db
      .update(wishlists)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(wishlists.id, wishlistId))
      .returning();

    return {
      success: true,
      message: "Wishlist updated successfully!",
      wishlist: updatedWishlistItem
    };
  }

  /**
   * Delete wishlist item - maintains exact same logic as original deleteWishlist
   */
  async deleteWishlist(userId: number, wishlistId: number) {
    const db = this.db.getDb();

    // Verify wishlist item belongs to user
    const wishlistItem = await db.query.wishlists.findFirst({
      where: and(eq(wishlists.id, wishlistId), eq(wishlists.userId, userId))
    });

    if (!wishlistItem) {
      throw new NotFoundException("Wishlist item not found");
    }

    // Delete wishlist item
    await db.delete(wishlists).where(eq(wishlists.id, wishlistId));

    return {
      success: true,
      message: "Item removed from wishlist successfully!"
    };
  }

  /**
   * Check if product is in wishlist
   */
  async isInWishlist(userId: number, productId: number): Promise<boolean> {
    const db = this.db.getDb();

    const wishlistItem = await db.query.wishlists.findFirst({
      where: and(
        eq(wishlists.userId, userId),
        eq(wishlists.productId, productId)
      )
    });

    return !!wishlistItem;
  }

  /**
   * Get wishlist count
   */
  async getWishlistCount(userId: number): Promise<number> {
    const db = this.db.getDb();

    const countResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(wishlists)
      .where(eq(wishlists.userId, userId));

    return countResult[0]?.count || 0;
  }
}
