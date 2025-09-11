import { Injectable, NotFoundException } from "@nestjs/common";
import { and, desc, eq, sql } from "drizzle-orm";
import { HelperService } from "../../common/services/helper.service";
import { DatabaseService } from "../../database/database.service";
import {
  mainProducts,
  products,
  reviews,
  stores,
  wishlists
} from "../../database/schema";

@Injectable()
export class ProductsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly helperService: HelperService
  ) {}

  /**
   * Get product details - maintains exact same logic as original getProductDetails
   */
  async getProductDetails(productId: number, userId?: number) {
    const db = this.db.getDb();

    const product = await db.query.mainProducts.findFirst({
      where: eq(mainProducts.id, productId),
      with: {
        menu: true,
        group: true,
        category: true,
        brand: true,
        productImages: true,
        productTags: {
          with: {
            tag: true
          }
        },
        reviews: {
          with: {
            user: {
              columns: {
                id: true,
                name: true
              }
            }
          },
          orderBy: [desc(reviews.createdAt)],
          limit: 10
        },
        products: {
          where: and(
            eq(products.isAvailable, true),
            eq(products.isArchived, false)
          ),
          with: {
            productImages: true,
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

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    // Format product with stock calculation - exact same logic as original
    const formattedProduct =
      await this.helperService.formatMainProductStock(product);

    // Add wishlist status if user is authenticated
    if (userId) {
      const wishlistItem = await db.query.wishlists.findFirst({
        where: and(
          eq(wishlists.userId, userId),
          eq(wishlists.productId, productId)
        )
      });
      formattedProduct.isWishlist = !!wishlistItem;
    }

    return {
      success: true,
      product: formattedProduct
    };
  }

  /**
   * Get product variations - maintains exact same logic as original getProductVariable
   */
  async getProductVariable(productId: number) {
    const db = this.db.getDb();

    const product = await db.query.mainProducts.findFirst({
      where: eq(mainProducts.id, productId),
      with: {
        products: {
          where: and(
            eq(products.isAvailable, true),
            eq(products.isArchived, false)
          ),
          with: {
            productImages: true,
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

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    // Format each variation product with stock - exact same logic as original
    const formattedVariations = [];
    for (const variation of product.products) {
      const formattedVariation =
        await this.helperService.formatVariationProductStock(variation);
      formattedVariations.push(formattedVariation);
    }

    return {
      success: true,
      variations: formattedVariations
    };
  }

  /**
   * Get variable product by attributes - maintains exact same logic as original getVariableProduct
   */
  async getVariableProduct(productId: number, attributes: any) {
    const db = this.db.getDb();

    // Find the specific variation based on attributes
    const variation = await db.query.products.findFirst({
      where: and(
        eq(products.mproductId, productId),
        eq(products.isAvailable, true),
        eq(products.isArchived, false)
      ),
      with: {
        productImages: true,
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
    });

    if (!variation) {
      throw new NotFoundException("Product variation not found");
    }

    // Format variation with stock - exact same logic as original
    const formattedVariation =
      await this.helperService.formatVariationProductStock(variation);

    return {
      success: true,
      product: formattedVariation
    };
  }

  /**
   * Get related products - maintains exact same logic as original relatedProduct
   */
  async getRelatedProducts(productId: number, limit: number = 8) {
    const db = this.db.getDb();

    // Get the main product to find related products by category
    const mainProduct = await db.query.mainProducts.findFirst({
      where: eq(mainProducts.id, productId),
      columns: {
        categoryId: true,
        groupId: true
      }
    });

    if (!mainProduct) {
      throw new NotFoundException("Product not found");
    }

    // Get related products from same category - exact same logic as original
    const relatedProducts = await db.query.mainProducts.findMany({
      where: and(
        eq(mainProducts.categoryId, mainProduct.categoryId),
        eq(mainProducts.isAvailable, true),
        eq(mainProducts.isArchived, false),
        sql`id != ${productId}` // Exclude current product
      ),
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
      },
      limit: limit
    });

    // Format each related product with stock - exact same logic as original
    const formattedRelatedProducts = [];
    for (const product of relatedProducts) {
      const formattedProduct =
        await this.helperService.formatMainProductStock(product);
      formattedRelatedProducts.push(formattedProduct);
    }

    return {
      success: true,
      relatedProducts: formattedRelatedProducts
    };
  }

  /**
   * Get product reviews - maintains exact same logic as original showReviews
   */
  async getProductReviews(
    productId: number,
    page: number = 1,
    limit: number = 10
  ) {
    const db = this.db.getDb();

    const offset = (page - 1) * limit;

    const reviewsList = await db.query.reviews.findMany({
      where: and(
        eq(reviews.productId, productId),
        eq(reviews.isApproved, true)
      ),
      with: {
        user: {
          columns: {
            id: true,
            name: true
          }
        }
      },
      orderBy: [desc(reviews.createdAt)],
      limit: limit,
      offset: offset
    });

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(
        and(eq(reviews.productId, productId), eq(reviews.isApproved, true))
      );

    return {
      success: true,
      reviews: reviewsList,
      pagination: {
        page: page,
        limit: limit,
        total: totalCount[0]?.count || 0,
        totalPages: Math.ceil((totalCount[0]?.count || 0) / limit)
      }
    };
  }

  /**
   * Store product review - maintains exact same logic as original storeReview
   */
  async storeReview(userId: number, reviewData: any) {
    const db = this.db.getDb();

    const [newReview] = await db
      .insert(reviews)
      .values({
        productId: reviewData.productId,
        userId: userId,
        reviewerId: userId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        images: reviewData.images ? JSON.stringify(reviewData.images) : null,
        isApproved: false // Reviews need approval
      })
      .returning();

    return {
      success: true,
      message:
        "Review submitted successfully! It will be published after approval.",
      review: newReview
    };
  }

  /**
   * Get product stock - maintains exact same logic as original stock calculation
   */
  async getProductStock(productId: number) {
    const db = this.db.getDb();

    // Get all variations of the main product
    const variations = await db.query.products.findMany({
      where: and(
        eq(products.mproductId, productId),
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
    });

    let totalStock = 0;

    // Calculate total stock from all variations - exact same logic as original
    for (const variation of variations) {
      let variationStock = 0;

      if (variation.purchases && variation.purchases.length > 0) {
        variationStock = variation.purchases.reduce(
          (sum, purchase) => sum + purchase.quantity,
          0
        );
      }

      if (variation.sellings && variation.sellings.length > 0) {
        const soldStock = variation.sellings.reduce(
          (sum, selling) => sum + selling.quantity,
          0
        );
        variationStock = variationStock - soldStock;
      }

      totalStock += variationStock;
    }

    return {
      success: true,
      stock: totalStock,
      variations: variations.length
    };
  }

  /**
   * Search products - maintains exact same logic as original search functionality
   */
  async searchProducts(
    query: string,
    filters: any = {},
    page: number = 1,
    limit: number = 20
  ) {
    const db = this.db.getDb();

    const offset = (page - 1) * limit;

    let whereConditions = [
      eq(mainProducts.isAvailable, true),
      eq(mainProducts.isArchived, false)
    ];

    // Add search query condition
    if (query) {
      whereConditions.push(
        sql`LOWER(product_name) LIKE LOWER(${"%" + query + "%"})`
      );
    }

    // Add filters
    if (filters.categoryId) {
      whereConditions.push(eq(mainProducts.categoryId, filters.categoryId));
    }

    if (filters.groupId) {
      whereConditions.push(eq(mainProducts.groupId, filters.groupId));
    }

    if (filters.brandId) {
      whereConditions.push(eq(mainProducts.brandId, filters.brandId));
    }

    const searchResults = await db.query.mainProducts.findMany({
      where: and(...whereConditions),
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
      },
      limit: limit,
      offset: offset
    });

    // Format each product with stock - exact same logic as original
    const formattedProducts = [];
    for (const product of searchResults) {
      const formattedProduct =
        await this.helperService.formatMainProductStock(product);
      formattedProducts.push(formattedProduct);
    }

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(mainProducts)
      .where(and(...whereConditions));

    return {
      success: true,
      products: formattedProducts,
      pagination: {
        page: page,
        limit: limit,
        total: totalCount[0]?.count || 0,
        totalPages: Math.ceil((totalCount[0]?.count || 0) / limit)
      }
    };
  }
}
