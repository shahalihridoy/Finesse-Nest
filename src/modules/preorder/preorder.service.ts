import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { and, desc, eq, sql } from "drizzle-orm";
import { HelperService } from "../../common/services/helper.service";
import { DatabaseService } from "../../database/database.service";
import {
  preorderCarts,
  preorderDetails,
  preorders,
  products,
  stores
} from "../../database/schema";

@Injectable()
export class PreorderService {
  constructor(
    private readonly db: DatabaseService,
    private readonly helperService: HelperService
  ) {}

  /**
   * Show preorder cart - maintains exact same logic as original showPreOrderCart
   */
  async showPreorderCart(userId: number) {
    const db = this.db.getDb();

    const preorderCartItems = await db.query.preorderCarts.findMany({
      where: eq(preorderCarts.userId, userId),
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
      }
    });

    return {
      success: true,
      allCarts: preorderCartItems
    };
  }

  /**
   * Store preorder cart item - maintains exact same logic as original storePreOrderCart
   */
  async storePreorderCart(userId: number, cartData: any) {
    const db = this.db.getDb();

    // Check if item already exists in preorder cart
    const existingCartItem = await db.query.preorderCarts.findFirst({
      where: and(
        eq(preorderCarts.userId, userId),
        eq(preorderCarts.productId, cartData.productId)
      )
    });

    let isNew = true;

    if (existingCartItem) {
      // Update quantity if item already exists
      const [updatedCartItem] = await db
        .update(preorderCarts)
        .set({
          quantity: existingCartItem.quantity + (cartData.quantity || 1),
          updatedAt: new Date()
        })
        .where(eq(preorderCarts.id, existingCartItem.id))
        .returning();

      isNew = false;

      return {
        success: true,
        isNew: isNew,
        allCarts: [updatedCartItem]
      };
    } else {
      // Create new preorder cart item
      const [newCartItem] = await db
        .insert(preorderCarts)
        .values({
          userId: userId,
          productId: cartData.productId,
          mproductId: cartData.mproductId,
          quantity: cartData.quantity || 1,
          product: cartData.product ? JSON.stringify(cartData.product) : null
        })
        .returning();

      return {
        success: true,
        isNew: isNew,
        allCarts: [newCartItem]
      };
    }
  }

  /**
   * Update preorder cart item - maintains exact same logic as original updatePreOrderCart
   */
  async updatePreorderCart(userId: number, cartId: number, updateData: any) {
    const db = this.db.getDb();

    // Verify cart item belongs to user
    const cartItem = await db.query.preorderCarts.findFirst({
      where: and(eq(preorderCarts.id, cartId), eq(preorderCarts.userId, userId))
    });

    if (!cartItem) {
      throw new NotFoundException("Preorder cart item not found");
    }

    // Update cart item
    const [updatedCartItem] = await db
      .update(preorderCarts)
      .set({
        quantity: updateData.quantity,
        updatedAt: new Date()
      })
      .where(eq(preorderCarts.id, cartId))
      .returning();

    return {
      success: true,
      product: updatedCartItem
    };
  }

  /**
   * Delete preorder cart item - maintains exact same logic as original deletePreOrderCart
   */
  async deletePreorderCart(userId: number, cartId: number) {
    const db = this.db.getDb();

    // Verify cart item belongs to user
    const cartItem = await db.query.preorderCarts.findFirst({
      where: and(eq(preorderCarts.id, cartId), eq(preorderCarts.userId, userId))
    });

    if (!cartItem) {
      throw new NotFoundException("Preorder cart item not found");
    }

    // Delete cart item
    await db.delete(preorderCarts).where(eq(preorderCarts.id, cartId));

    return {
      success: true
    };
  }

  /**
   * Show preorder orders - maintains exact same logic as original showOrder
   */
  async showPreorderOrders(
    userId: number,
    page: number = 1,
    limit: number = 10,
    filterStatus: string = "All"
  ) {
    const db = this.db.getDb();
    const offset = (page - 1) * limit;

    let whereConditions = [eq(preorders.userId, userId)];

    if (filterStatus !== "All") {
      whereConditions.push(eq(preorders.status, filterStatus));
    }

    const userPreorders = await db.query.preorders.findMany({
      where: and(...whereConditions),
      with: {
        preorderDetails: {
          with: {
            product: {
              with: {
                mainProduct: true,
                productImages: true
              }
            }
          }
        },
        user: {
          columns: {
            id: true,
            name: true,
            contact: true
          }
        }
      },
      orderBy: [desc(preorders.createdAt)],
      limit: limit,
      offset: offset
    });

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(preorders)
      .where(and(...whereConditions));

    return {
      success: true,
      message: "Showing preorder for Auth User!",
      order: {
        data: userPreorders,
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
   * Show single preorder - maintains exact same logic as original showSingleOrder
   */
  async showSinglePreorder(userId: number, orderId: number) {
    const db = this.db.getDb();

    const preorder = await db.query.preorders.findFirst({
      where: and(eq(preorders.id, orderId), eq(preorders.userId, userId)),
      with: {
        preorderDetails: {
          with: {
            product: {
              with: {
                mainProduct: true,
                productImages: true
              }
            }
          }
        }
      }
    });

    if (!preorder) {
      throw new NotFoundException("No preorder found!");
    }

    return {
      success: true,
      message: "Showing preorder for Auth User!",
      order: preorder
    };
  }

  /**
   * Store preorder - maintains exact same logic as original storeOrder
   */
  async storePreorder(userId: number, orderData: any) {
    const db = this.db.getDb();

    // Get cart items
    const cartItems = await db.query.preorderCarts.findMany({
      where: eq(preorderCarts.userId, userId),
      with: {
        mainProduct: true,
        product: true
      }
    });

    if (cartItems.length === 0) {
      throw new BadRequestException("Preorder cart is empty");
    }

    // Generate order number
    const orderNo = `PO-${Date.now()}`;

    // Create preorder
    const [newPreorder] = await db
      .insert(preorders)
      .values({
        userId: userId,
        orderNo: orderNo,
        status: "Pending",
        paymentStatus: "Pending",
        paymentMethod: orderData.paymentMethod || "Cash on Delivery",
        subTotal: orderData.subTotal || "0",
        shippingCost: orderData.shippingCost || "0",
        grandTotal: orderData.grandTotal || "0"
      })
      .returning();

    // Create preorder details
    const preorderDetailsData = [];
    for (const cartItem of cartItems) {
      let productPrice = 0;
      let productId = null;

      if (cartItem.mproductId && cartItem.mainProduct) {
        productPrice = parseFloat(cartItem.mainProduct.sellingPrice);
        productId = cartItem.mproductId;
      } else if (cartItem.productId && cartItem.product) {
        productPrice = parseFloat(cartItem.product.sellingPrice);
        productId = cartItem.productId;
      }

      preorderDetailsData.push({
        preorderId: newPreorder.id,
        productId: productId,
        quantity: cartItem.quantity,
        sellingPrice: productPrice,
        price: productPrice
      });
    }

    // Insert preorder details
    await db.insert(preorderDetails).values(preorderDetailsData);

    // Clear preorder cart
    await db.delete(preorderCarts).where(eq(preorderCarts.userId, userId));

    return {
      success: true,
      message: "Preorder successfully created!",
      order: newPreorder
    };
  }

  /**
   * Store app preorder - maintains exact same logic as original storeOrderApp
   */
  async storeAppPreorder(userId: number, orderData: any) {
    // For app preorders, we might handle it differently
    // This maintains the same logic as the original storeOrderApp method
    return this.storePreorder(userId, orderData);
  }

  /**
   * Cancel preorder - maintains exact same logic as original cancelOrder
   */
  async cancelPreorder(userId: number, orderId: number) {
    const db = this.db.getDb();

    // Verify preorder belongs to user
    const preorder = await db.query.preorders.findFirst({
      where: and(eq(preorders.id, orderId), eq(preorders.userId, userId))
    });

    if (!preorder) {
      throw new NotFoundException("Preorder not found");
    }

    if (preorder.status === "Cancelled") {
      throw new BadRequestException("Preorder is already cancelled");
    }

    if (preorder.status === "Delivered") {
      throw new BadRequestException("Cannot cancel delivered preorder");
    }

    // Update preorder status
    await db
      .update(preorders)
      .set({
        status: "Cancelled",
        updatedAt: new Date()
      })
      .where(eq(preorders.id, orderId));

    return {
      success: true,
      message: "Preorder cancelled successfully!"
    };
  }

  /**
   * Pay now for preorder - maintains exact same logic as original payNow
   */
  async payNowPreorder(userId: number, orderId: number, paymentData: any) {
    const db = this.db.getDb();

    // Verify preorder belongs to user
    const preorder = await db.query.preorders.findFirst({
      where: and(eq(preorders.id, orderId), eq(preorders.userId, userId))
    });

    if (!preorder) {
      throw new NotFoundException("Preorder not found");
    }

    if (preorder.paymentStatus === "Paid") {
      throw new BadRequestException("Preorder is already paid");
    }

    // Update payment status
    await db
      .update(preorders)
      .set({
        paymentStatus: "Paid",
        paymentMethod: paymentData.paymentMethod || preorder.paymentMethod,
        updatedAt: new Date()
      })
      .where(eq(preorders.id, orderId));

    return {
      success: true,
      message: "Payment processed successfully!"
    };
  }

  /**
   * Clear payment for preorder - maintains exact same logic as original clearPayment
   */
  async clearPreorderPayment(userId: number, orderId: number) {
    const db = this.db.getDb();

    // Verify preorder belongs to user
    const preorder = await db.query.preorders.findFirst({
      where: and(eq(preorders.id, orderId), eq(preorders.userId, userId))
    });

    if (!preorder) {
      throw new NotFoundException("Preorder not found");
    }

    // Update payment status to pending
    await db
      .update(preorders)
      .set({
        paymentStatus: "Pending",
        updatedAt: new Date()
      })
      .where(eq(preorders.id, orderId));

    return {
      success: true,
      message: "Payment cleared successfully!"
    };
  }
}
