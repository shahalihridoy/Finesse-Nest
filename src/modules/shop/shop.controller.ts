import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ShopService } from "./shop.service";

@ApiTags("Shop")
@Controller("shop")
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get("colors")
  @ApiOperation({ summary: "Get all available colors" })
  @ApiResponse({
    status: 200,
    description: "Colors retrieved successfully",
    example: {
      success: true,
      colors: [
        {
          id: 1,
          name: "Red",
          hexCode: "#FF0000"
        },
        {
          id: 2,
          name: "Blue",
          hexCode: "#0000FF"
        }
      ]
    }
  })
  async getAllColors() {
    return this.shopService.getAllColors();
  }

  @Get("groups")
  @ApiOperation({ summary: "Get all product groups" })
  @ApiResponse({
    status: 200,
    description: "Groups retrieved successfully",
    example: {
      success: true,
      groups: [
        {
          id: 1,
          name: "Electronics",
          isActive: true,
          categories: [
            {
              id: 1,
              name: "Smartphones",
              isActive: true
            }
          ]
        }
      ]
    }
  })
  async getAllGroups() {
    return this.shopService.getAllGroups();
  }

  @Get("groups/:name")
  async getMenuGroups(@Param("name") menuName: string) {
    return this.shopService.getMenuGroups(menuName);
  }

  @Get("page-data")
  async getShopPageData() {
    return this.shopService.getShopPageData();
  }

  @Get("sale-page-data")
  async getSalePageData() {
    return this.shopService.getSalePageData();
  }

  @Get("screen-data")
  async getShopScreenData() {
    return this.shopService.getShopScreenData();
  }

  @Get("sale-screen-data")
  async getSaleScreenData() {
    return this.shopService.getSaleScreenData();
  }

  @Get("tags")
  async getAllTags() {
    return this.shopService.getAllTags();
  }

  @Get("brands")
  async getAllBrands() {
    return this.shopService.getAllBrands();
  }

  @Get("products")
  @ApiOperation({ summary: "Get shop products with filters" })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number",
    type: "number"
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Items per page",
    type: "number"
  })
  @ApiQuery({
    name: "category",
    required: false,
    description: "Category ID",
    type: "number"
  })
  @ApiQuery({
    name: "brand",
    required: false,
    description: "Brand ID",
    type: "number"
  })
  @ApiQuery({
    name: "group",
    required: false,
    description: "Group ID",
    type: "number"
  })
  @ApiQuery({
    name: "search",
    required: false,
    description: "Search query",
    type: "string"
  })
  @ApiQuery({
    name: "sort",
    required: false,
    description: "Sort by (price_low, price_high, name, newest)",
    type: "string"
  })
  @ApiQuery({
    name: "minPrice",
    required: false,
    description: "Minimum price",
    type: "number"
  })
  @ApiQuery({
    name: "maxPrice",
    required: false,
    description: "Maximum price",
    type: "number"
  })
  @ApiResponse({
    status: 200,
    description: "Products retrieved successfully",
    example: {
      success: true,
      products: {
        data: [
          {
            id: 1,
            name: "Sample Product",
            description: "Product description",
            sellingPrice: "100.00",
            discount: "10.00",
            sku: "PROD-001",
            isAvailable: true,
            isFeatured: true,
            group: {
              id: 1,
              name: "Electronics"
            },
            category: {
              id: 1,
              name: "Smartphones"
            },
            brand: {
              id: 1,
              name: "Samsung"
            },
            productImages: [
              {
                id: 1,
                image: "product1.jpg",
                isPrimary: true
              }
            ],
            stock: 50
          }
        ],
        pagination: {
          page: 1,
          limit: 12,
          total: 100,
          totalPages: 9
        }
      }
    }
  })
  async getShopProducts(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("category") categoryId?: number,
    @Query("brand") brandId?: number,
    @Query("group") groupId?: number,
    @Query("search") search?: string,
    @Query("sort") sortBy?: string,
    @Query("minPrice") minPrice?: number,
    @Query("maxPrice") maxPrice?: number
  ) {
    return this.shopService.getShopProducts(
      page ? parseInt(page.toString()) : 1,
      limit ? parseInt(limit.toString()) : 12,
      categoryId ? parseInt(categoryId.toString()) : undefined,
      brandId ? parseInt(brandId.toString()) : undefined,
      groupId ? parseInt(groupId.toString()) : undefined,
      search,
      sortBy,
      minPrice ? parseFloat(minPrice.toString()) : undefined,
      maxPrice ? parseFloat(maxPrice.toString()) : undefined
    );
  }

  @Get("featured")
  async getFeaturedProducts(@Query("limit") limit?: number) {
    return this.shopService.getFeaturedProducts(
      limit ? parseInt(limit.toString()) : 8
    );
  }

  @Get("latest")
  async getLatestProducts(@Query("limit") limit?: number) {
    return this.shopService.getLatestProducts(
      limit ? parseInt(limit.toString()) : 8
    );
  }

  @Get("search")
  async searchProducts(
    @Query("q") query: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("sort") sortBy?: string
  ) {
    return this.shopService.searchProducts(
      query,
      page ? parseInt(page.toString()) : 1,
      limit ? parseInt(limit.toString()) : 12,
      sortBy
    );
  }
}
