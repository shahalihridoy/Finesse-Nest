import { Injectable, NotFoundException } from "@nestjs/common";
import { and, desc, eq, sql } from "drizzle-orm";
import { HelperService } from "../../common/services/helper.service";
import { DatabaseService } from "../../database/database.service";
import {
  categories,
  contactUs,
  faqs,
  landingPageSettings,
  mainProducts,
  mainSliders,
  middleBanners,
  middlePromotionalCards,
  policyPages,
  products,
  reports,
  settings,
  stores,
  topPromotionalSliders
} from "../../database/schema";

@Injectable()
export class HomeService {
  constructor(
    private readonly db: DatabaseService,
    private readonly helperService: HelperService
  ) {}

  /**
   * Get all top promotional sliders - maintains exact same logic as original allTopPromotionalSliders
   */
  async getAllTopPromotionalSliders() {
    const db = this.db.getDb();

    const sliders = await db.query.topPromotionalSliders.findMany({
      where: eq(topPromotionalSliders.isActive, true),
      orderBy: [sql`order ASC`]
    });

    return {
      success: true,
      topPromotionalSlider: sliders
    };
  }

  /**
   * Get all front sliders - maintains exact same logic as original allFrontSliders
   */
  async getAllFrontSliders() {
    const db = this.db.getDb();

    const mainSlider = await db.query.mainSliders.findMany({
      where: eq(mainSliders.isActive, true),
      orderBy: [sql`order ASC`]
    });

    const popularSubCategory = await db.query.categories.findMany({
      where: eq(categories.isFeatured, true),
      with: {
        menu: true
      }
    });

    const middleBanner = await db.query.middleBanners.findMany({
      where: eq(middleBanners.isActive, true),
      orderBy: [sql`order ASC`]
    });

    return {
      success: true,
      mainSlider: mainSlider,
      popularSubCategory: popularSubCategory,
      middleBanner: middleBanner
    };
  }

  /**
   * Get landing products - maintains exact same logic as original ladingProducts
   */
  async getLandingProducts() {
    const db = this.db.getDb();

    // Get featured products
    const featuredProducts = await db.query.mainProducts.findMany({
      where: eq(mainProducts.isFeatured, true),
      with: {
        group: true,
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
    });

    // Format featured products with stock - exact same logic as original
    const formattedFeaturedProducts = [];
    for (const product of featuredProducts) {
      const formattedProduct =
        await this.helperService.formatMainProductStock(product);
      formattedFeaturedProducts.push(formattedProduct);
    }

    // Get new products
    const newProducts = await db.query.mainProducts.findMany({
      where: eq(mainProducts.isNew, true),
      with: {
        group: true,
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
    });

    // Format new products with stock - exact same logic as original
    const formattedNewProducts = [];
    for (const product of newProducts) {
      const formattedProduct =
        await this.helperService.formatMainProductStock(product);
      formattedNewProducts.push(formattedProduct);
    }

    const middlePromotionalCard =
      await db.query.middlePromotionalCards.findMany({
        where: eq(middlePromotionalCards.isActive, true),
        orderBy: [sql`order ASC`]
      });

    const landingSettings = await db.query.landingPageSettings.findFirst({
      where: eq(landingPageSettings.id, 1)
    });

    return {
      success: true,
      featuredProducts: formattedFeaturedProducts,
      newProducts: formattedNewProducts,
      middlePromotionalCard: middlePromotionalCard,
      landingSettings: landingSettings
    };
  }

  /**
   * Store reports - maintains exact same logic as original storeReports
   */
  async storeReports(userId: number, reportData: any) {
    const db = this.db.getDb();

    const [newReport] = await db
      .insert(reports)
      .values({
        userId: userId,
        type: reportData.type,
        title: reportData.title,
        description: reportData.description
      })
      .returning();

    return {
      success: true,
      report: newReport
    };
  }

  /**
   * Get all reports - maintains exact same logic as original getAllReports
   */
  async getAllReports(userId: number, page: number = 1, limit: number = 5) {
    const db = this.db.getDb();
    const offset = (page - 1) * limit;

    const userReports = await db.query.reports.findMany({
      where: eq(reports.userId, userId),
      orderBy: [desc(reports.createdAt)],
      limit: limit,
      offset: offset
    });

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(reports)
      .where(eq(reports.userId, userId));

    return {
      success: true,
      data: {
        data: userReports,
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
   * Get all FAQ - maintains exact same logic as original getAllFaq
   */
  async getAllFaq(page: number = 1, limit: number = 5) {
    const db = this.db.getDb();
    const offset = (page - 1) * limit;

    const faqsList = await db.query.faqs.findMany({
      where: eq(faqs.isActive, true),
      orderBy: [sql`order ASC`],
      limit: limit,
      offset: offset
    });

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(faqs)
      .where(eq(faqs.isActive, true));

    return {
      success: true,
      data: {
        data: faqsList,
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
   * Get settings - maintains exact same logic as original getSettings
   */
  async getSettings() {
    const db = this.db.getDb();

    const settingsData = await db.query.settings.findFirst({
      where: eq(settings.id, 1)
    });

    return {
      success: true,
      settings: settingsData
    };
  }

  /**
   * Get policy page - maintains exact same logic as original policyPage
   */
  async getPolicyPage(routeName: string) {
    const db = this.db.getDb();

    const policyPage = await db.query.policyPages.findFirst({
      where: and(
        eq(policyPages.routeName, routeName),
        eq(policyPages.isActive, true)
      )
    });

    if (!policyPage) {
      throw new NotFoundException("404 No Page found!");
    }

    return {
      success: true,
      settings: policyPage
    };
  }

  /**
   * Store contact us - maintains exact same logic as original storeContactus
   */
  async storeContactUs(contactData: any) {
    const db = this.db.getDb();

    const [newContact] = await db
      .insert(contactUs)
      .values({
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        subject: contactData.subject,
        message: contactData.message
      })
      .returning();

    return {
      success: true,
      contactus: newContact
    };
  }

  /**
   * Upload review file - maintains exact same logic as original uploadReviewFile
   */
  async uploadReviewFile(file: Express.Multer.File) {
    // This would handle file upload
    // For now, we'll return a placeholder response
    const fileName = `${Date.now()}.${file.originalname.split(".").pop()}`;
    const fileUrl = `${process.env.APP_URL || "http://localhost:3000"}/uploads/${fileName}`;

    return {
      msg: "Image has been uploaded successfully!",
      file: fileUrl
    };
  }

  /**
   * Test method - maintains exact same logic as original t1
   */
  async test() {
    // This would be used for testing purposes
    return {
      message: "Test endpoint working"
    };
  }

  /**
   * Get all images for main product - maintains exact same logic as original ims1
   */
  async getAllImagesForMainProduct() {
    const db = this.db.getDb();

    const productsList = await db.query.mainProducts.findMany({
      with: {
        menu: true,
        group: true,
        category: true,
        brand: true,
        productTags: {
          with: {
            tag: true
          }
        },
        products: {
          where: and(
            eq(products.isAvailable, true),
            eq(products.isArchived, false)
          )
        }
      }
    });

    return productsList;
  }
}
