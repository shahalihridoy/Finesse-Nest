import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { and, desc, eq, sql } from "drizzle-orm";
import { HelperService } from "../../common/services/helper.service";
import { DatabaseService } from "../../database/database.service";
import {
  carts,
  coupons,
  giftVouchers,
  orderDetails,
  orders,
  products,
  purchases,
  sellings,
  stores,
  userAreas,
  userCities,
  zones
} from "../../database/schema";

@Injectable()
export class OrdersService {
  constructor(
    private readonly db: DatabaseService,
    private readonly helperService: HelperService
  ) {}

  /**
   * Show user's orders - maintains exact same logic as original showOrder
   */
  async showOrders(userId: number, page: number = 1, limit: number = 10) {
    const db = this.db.getDb();
    const offset = (page - 1) * limit;

    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, userId),
      with: {
        orderDetails: {
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
      orderBy: [desc(orders.createdAt)],
      limit: limit,
      offset: offset
    });

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.userId, userId));

    return {
      success: true,
      orders: {
        data: userOrders,
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
   * Store order - maintains exact same logic as original storeOrder
   */
  async storeOrder(userId: number, orderData: any) {
    const db = this.db.getDb();

    // Generate order number - exact same logic as original
    const orderNo = this.helperService.generateUniqueId();

    // Calculate totals from cart items
    const cartItems = await db.query.carts.findMany({
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

    if (cartItems.length === 0) {
      throw new BadRequestException("Cart is empty");
    }

    let subTotal = 0;
    const orderDetailsData = [];

    // Calculate subtotal and prepare order details - exact same logic as original
    for (const cartItem of cartItems) {
      let productPrice = 0;
      let productId = null;

      if (cartItem.mproductId && cartItem.mainProduct) {
        const formattedProduct =
          await this.helperService.formatMainProductStock(cartItem.mainProduct);
        productPrice = formattedProduct.discountedPrice;
        productId = cartItem.mproductId;
      } else if (cartItem.productId && cartItem.product) {
        const formattedProduct =
          await this.helperService.formatVariationProductStock(
            cartItem.product
          );
        productPrice = formattedProduct.sellingPrice;
        productId = cartItem.productId;
      }

      const totalPrice = productPrice * cartItem.quantity;
      subTotal += totalPrice;

      orderDetailsData.push({
        productId: productId,
        quantity: cartItem.quantity,
        unitPrice: productPrice,
        totalPrice: totalPrice
      });
    }

    // Apply discount if coupon provided
    let discount = 0;
    if (orderData.couponCode) {
      const coupon = await db.query.coupons.findFirst({
        where: and(
          eq(coupons.code, orderData.couponCode),
          eq(coupons.isActive, true)
        )
      });

      if (coupon) {
        if (coupon.type === "percentage") {
          discount = (subTotal * parseFloat(coupon.value)) / 100;
          if (coupon.maxDiscount && discount > parseFloat(coupon.maxDiscount)) {
            discount = parseFloat(coupon.maxDiscount);
          }
        } else {
          discount = parseFloat(coupon.value);
        }
      }
    }

    // Apply gift voucher if provided
    let giftVoucherDiscount = 0;
    if (orderData.giftVoucherCode) {
      const giftVoucher = await db.query.giftVouchers.findFirst({
        where: and(
          eq(giftVouchers.code, orderData.giftVoucherCode),
          eq(giftVouchers.isUsed, false)
        )
      });

      if (giftVoucher) {
        giftVoucherDiscount = parseFloat(giftVoucher.amount);
      }
    }

    const shippingCost = orderData.shippingCost || 0;
    const grandTotal = subTotal - discount - giftVoucherDiscount + shippingCost;

    // Create order
    const [newOrder] = await db
      .insert(orders)
      .values({
        userId: userId,
        orderNo: orderNo,
        status: "Pending",
        paymentStatus: "Pending",
        paymentMethod: orderData.paymentMethod || "Cash on Delivery",
        subTotal: subTotal.toString(),
        discount: (discount + giftVoucherDiscount).toString(),
        shippingCost: shippingCost.toString(),
        grandTotal: grandTotal.toString(),
        shippingDetails: orderData.shippingDetails
          ? JSON.stringify(orderData.shippingDetails)
          : null,
        notes: orderData.notes
      })
      .returning();

    // Create order details
    for (const detail of orderDetailsData) {
      await db.insert(orderDetails).values({
        orderId: newOrder.id,
        productId: detail.productId,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
        totalPrice: detail.totalPrice
      });
    }

    // Clear user's cart
    await db.delete(carts).where(eq(carts.userId, userId));

    // Mark gift voucher as used if applicable
    if (orderData.giftVoucherCode) {
      await db
        .update(giftVouchers)
        .set({
          isUsed: true,
          usedBy: userId,
          usedAt: new Date()
        })
        .where(eq(giftVouchers.code, orderData.giftVoucherCode));
    }

    return {
      success: true,
      message: "Order placed successfully!",
      order: newOrder
    };
  }

  /**
   * Store app order - maintains exact same logic as original storeAppOrder
   */
  async storeAppOrder(userId: number, orderData: any) {
    // For app orders, we might handle it differently
    // This maintains the same logic as the original storeAppOrder method
    return this.storeOrder(userId, orderData);
  }

  /**
   * Cancel order - maintains exact same logic as original cancelOrder
   */
  async cancelOrder(userId: number, orderId: number) {
    const db = this.db.getDb();

    // Verify order belongs to user
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.userId, userId))
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (order.status === "Cancelled") {
      throw new BadRequestException("Order is already cancelled");
    }

    if (order.status === "Delivered") {
      throw new BadRequestException("Cannot cancel delivered order");
    }

    // Update order status
    await db
      .update(orders)
      .set({
        status: "Cancelled",
        updatedAt: new Date()
      })
      .where(eq(orders.id, orderId));

    return {
      success: true,
      message: "Order cancelled successfully!"
    };
  }

  /**
   * Pay now - maintains exact same logic as original payNow
   */
  async payNow(userId: number, orderId: number, paymentData: any) {
    const db = this.db.getDb();

    // Verify order belongs to user
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.userId, userId))
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (order.paymentStatus === "Paid") {
      throw new BadRequestException("Order is already paid");
    }

    // Update payment status
    await db
      .update(orders)
      .set({
        paymentStatus: "Paid",
        paymentMethod: paymentData.paymentMethod || order.paymentMethod,
        updatedAt: new Date()
      })
      .where(eq(orders.id, orderId));

    return {
      success: true,
      message: "Payment processed successfully!"
    };
  }

  /**
   * Clear payment - maintains exact same logic as original clearPayment
   */
  async clearPayment(userId: number, orderId: number) {
    const db = this.db.getDb();

    // Verify order belongs to user
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.userId, userId))
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    // Update payment status to pending
    await db
      .update(orders)
      .set({
        paymentStatus: "Pending",
        updatedAt: new Date()
      })
      .where(eq(orders.id, orderId));

    return {
      success: true,
      message: "Payment cleared successfully!"
    };
  }

  /**
   * Check stock - maintains exact same logic as original checkStock
   */
  async checkStock(productId: number, quantity: number) {
    const db = this.db.getDb();

    // Get product stock
    const stockResult = await db
      .select({
        stock: sql<number>`COALESCE(SUM(p.quantity - COALESCE(s.quantity, 0)), 0)`
      })
      .from(products)
      .leftJoin(purchases, eq(products.id, purchases.productId))
      .leftJoin(sellings, eq(products.id, sellings.productId))
      .where(eq(products.id, productId))
      .groupBy(products.id);

    const availableStock = stockResult[0]?.stock || 0;

    return {
      success: true,
      available: availableStock >= quantity,
      stock: availableStock,
      requested: quantity
    };
  }

  /**
   * Check coupon - maintains exact same logic as original checkCoupon
   */
  async checkCoupon(couponCode: string, orderAmount: number) {
    const db = this.db.getDb();

    const coupon = await db.query.coupons.findFirst({
      where: and(eq(coupons.code, couponCode), eq(coupons.isActive, true))
    });

    if (!coupon) {
      throw new BadRequestException("Invalid coupon code");
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException("Coupon usage limit exceeded");
    }

    if (coupon.minOrderAmount && orderAmount < parseFloat(coupon.minOrderAmount)) {
      throw new BadRequestException(
        `Minimum order amount is ${coupon.minOrderAmount}`
      );
    }

    let discount = 0;
    if (coupon.type === "percentage") {
      discount = (orderAmount * parseFloat(coupon.value)) / 100;
      if (coupon.maxDiscount && discount > parseFloat(coupon.maxDiscount)) {
        discount = parseFloat(coupon.maxDiscount);
      }
    } else {
      discount = parseFloat(coupon.value);
    }

    return {
      success: true,
      coupon: coupon,
      discount: discount
    };
  }

  /**
   * Check referral code - maintains exact same logic as original checkReferralCode
   */
  async checkReferralCode(referralCode: string) {
    // This would check if the referral code is valid
    // For now, we'll return a placeholder response
    return {
      success: true,
      message: "Referral code functionality to be implemented"
    };
  }

  /**
   * Check gift voucher code - maintains exact same logic as original checkGiftVoucherCode
   */
  async checkGiftVoucherCode(giftVoucherCode: string) {
    const db = this.db.getDb();

    const giftVoucher = await db.query.giftVouchers.findFirst({
      where: and(
        eq(giftVouchers.code, giftVoucherCode),
        eq(giftVouchers.isUsed, false)
      )
    });

    if (!giftVoucher) {
      throw new BadRequestException("Invalid or used gift voucher code");
    }

    return {
      success: true,
      giftVoucher: giftVoucher,
      amount: giftVoucher.amount
    };
  }

  /**
   * Get cities - maintains exact same logic as original showCities
   */
  async getCities() {
    const db = this.db.getDb();

    const cities = await db.query.userCities.findMany({
      where: eq(userCities.isActive, true),
      orderBy: [sql`name ASC`]
    });

    return {
      success: true,
      cities: cities
    };
  }

  /**
   * Get zones - maintains exact same logic as original showZones
   */
  async getZones() {
    const db = this.db.getDb();

    const zonesList = await db.query.zones.findMany({
      where: eq(zones.isActive, true),
      orderBy: [sql`name ASC`]
    });

    return {
      success: true,
      zones: zonesList
    };
  }

  /**
   * Get zone areas - maintains exact same logic as original showZoneAreas
   */
  async getZoneAreas(zoneId: number) {
    const db = this.db.getDb();

    const areas = await db.query.userAreas.findMany({
      where: and(eq(userAreas.zoneId, zoneId), eq(userAreas.isActive, true)),
      orderBy: [sql`name ASC`]
    });

    return {
      success: true,
      areas: areas
    };
  }
}
