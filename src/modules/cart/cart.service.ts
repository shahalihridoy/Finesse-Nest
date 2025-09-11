import { Injectable, NotFoundException } from "@nestjs/common";
import { and, eq, sql } from "drizzle-orm";
import { HelperService } from "../../common/services/helper.service";
import { DatabaseService } from "../../database/database.service";
import { carts, products, stores } from "../../database/schema";

@Injectable()
export class CartService {
  constructor(
    private readonly db: DatabaseService,
    private readonly helperService: HelperService
  ) {}

  /**
   * Show user's cart - maintains exact same logic as original showCarts
   */
  async showCarts(userId: number, page: number = 1, limit: number = 10) {
    const db = this.db.getDb();
    const offset = (page - 1) * limit;

    const userCarts = await db.query.carts.findMany({
      where: eq(carts.userId, userId),
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
        },
        product: {
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
      orderBy: [sql`created_at DESC`],
      limit: limit,
      offset: offset
    });

    // Format cart items with stock calculation - exact same logic as original
    const formattedCarts = [];
    for (const cartItem of userCarts) {
      let formattedProduct = null;

      if (cartItem.mproductId && cartItem.mainProduct) {
        // Format main product with stock
        formattedProduct = await this.helperService.formatMainProductStock(
          cartItem.mainProduct
        );
      } else if (cartItem.productId && cartItem.product) {
        // Format variation product with stock
        formattedProduct = await this.helperService.formatVariationProductStock(
          cartItem.product
        );
      }

      formattedCarts.push({
        id: cartItem.id,
        quantity: cartItem.quantity,
        product: formattedProduct,
        createdAt: cartItem.createdAt,
        updatedAt: cartItem.updatedAt
      });
    }

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(carts)
      .where(eq(carts.userId, userId));

    return {
      success: true,
      carts: {
        data: formattedCarts,
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
   * Store cart item - maintains exact same logic as original storeCart
   */
  async storeCart(userId: number, cartData: any) {
    const db = this.db.getDb();

    // Check if item already exists in cart
    const existingCartItem = await db.query.carts.findFirst({
      where: and(
        eq(carts.userId, userId),
        eq(carts.mproductId, cartData.mproductId || null),
        eq(carts.productId, cartData.productId || null)
      )
    });

    if (existingCartItem) {
      // Update quantity if item already exists
      const [updatedCartItem] = await db
        .update(carts)
        .set({
          quantity: existingCartItem.quantity + (cartData.quantity || 1),
          updatedAt: new Date()
        })
        .where(eq(carts.id, existingCartItem.id))
        .returning();

      return {
        success: true,
        message: "Cart updated successfully!",
        cart: updatedCartItem
      };
    } else {
      // Create new cart item
      const [newCartItem] = await db
        .insert(carts)
        .values({
          userId: userId,
          mproductId: cartData.mproductId || null,
          productId: cartData.productId || null,
          quantity: cartData.quantity || 1,
          product: cartData.product ? JSON.stringify(cartData.product) : null
        })
        .returning();

      return {
        success: true,
        message: "Item added to cart successfully!",
        cart: newCartItem
      };
    }
  }

  /**
   * Store app cart - maintains exact same logic as original storeAppCart
   */
  async storeAppCart(userId: number, cartData: any) {
    const db = this.db.getDb();

    // For app cart, we might handle it differently
    // This maintains the same logic as the original storeAppCart method
    return this.storeCart(userId, cartData);
  }

  /**
   * Update cart item - maintains exact same logic as original updateCart
   */
  async updateCart(userId: number, cartId: number, updateData: any) {
    const db = this.db.getDb();

    // Verify cart item belongs to user
    const cartItem = await db.query.carts.findFirst({
      where: and(eq(carts.id, cartId), eq(carts.userId, userId))
    });

    if (!cartItem) {
      throw new NotFoundException("Cart item not found");
    }

    // Update cart item
    const [updatedCartItem] = await db
      .update(carts)
      .set({
        quantity: updateData.quantity,
        updatedAt: new Date()
      })
      .where(eq(carts.id, cartId))
      .returning();

    return {
      success: true,
      message: "Cart updated successfully!",
      cart: updatedCartItem
    };
  }

  /**
   * Delete cart item - maintains exact same logic as original deleteCart
   */
  async deleteCart(userId: number, cartId: number) {
    const db = this.db.getDb();

    // Verify cart item belongs to user
    const cartItem = await db.query.carts.findFirst({
      where: and(eq(carts.id, cartId), eq(carts.userId, userId))
    });

    if (!cartItem) {
      throw new NotFoundException("Cart item not found");
    }

    // Delete cart item
    await db.delete(carts).where(eq(carts.id, cartId));

    return {
      success: true,
      message: "Item removed from cart successfully!"
    };
  }

  /**
   * Clear user's cart - maintains exact same logic as original clearCart
   */
  async clearCart(userId: number) {
    const db = this.db.getDb();

    await db.delete(carts).where(eq(carts.userId, userId));

    return {
      success: true,
      message: "Cart cleared successfully!"
    };
  }

  /**
   * Get cart count - maintains exact same logic as original getCartCount
   */
  async getCartCount(userId: number) {
    const db = this.db.getDb();

    const countResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(carts)
      .where(eq(carts.userId, userId));

    const count = countResult[0]?.count || 0;

    return {
      success: true,
      count: count
    };
  }

  /**
   * Get cart total - maintains exact same logic as original getCartTotal
   */
  async getCartTotal(userId: number) {
    const db = this.db.getDb();

    const userCarts = await db.query.carts.findMany({
      where: eq(carts.userId, userId),
      with: {
        mainProduct: {
          with: {
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
        },
        product: {
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
    });

    let totalAmount = 0;
    let totalItems = 0;

    // Calculate total - exact same logic as original
    for (const cartItem of userCarts) {
      let productPrice = 0;

      if (cartItem.mproductId && cartItem.mainProduct) {
        const formattedProduct =
          await this.helperService.formatMainProductStock(cartItem.mainProduct);
        productPrice = formattedProduct.discountedPrice;
      } else if (cartItem.productId && cartItem.product) {
        const formattedProduct =
          await this.helperService.formatVariationProductStock(
            cartItem.product
          );
        productPrice = formattedProduct.sellingPrice;
      }

      totalAmount += productPrice * cartItem.quantity;
      totalItems += cartItem.quantity;
    }

    return {
      success: true,
      total: totalAmount,
      items: totalItems
    };
  }
}
