import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Request,
  UseGuards
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateReviewDto } from "./dto/create-review.dto";
import { GetVariableProductDto } from "./dto/get-variable-product.dto";
import { ProductsService } from "./products.service";

@ApiTags("Products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get("details/:id")
  @ApiOperation({ summary: "Get product details by ID" })
  @ApiParam({
    name: "id",
    description: "Product ID",
    type: "string",
    format: "uuid"
  })
  @ApiResponse({
    status: 200,
    description: "Product details retrieved successfully",
    example: {
      success: true,
      product: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "Sample Product",
        description: "This is a sample product description",
        sellingPrice: "100.00",
        discount: "10.00",
        sku: "PROD-001",
        isAvailable: true,
        isFeatured: true,
        group: {
          id: "550e8400-e29b-41d4-a716-446655440001",
          name: "Electronics"
        },
        category: {
          id: "550e8400-e29b-41d4-a716-446655440002",
          name: "Smartphones"
        },
        brand: {
          id: "550e8400-e29b-41d4-a716-446655440003",
          name: "Samsung"
        },
        productImages: [
          {
            id: "550e8400-e29b-41d4-a716-446655440004",
            image: "product1.jpg",
            isPrimary: true
          }
        ],
        products: [
          {
            id: "550e8400-e29b-41d4-a716-446655440005",
            name: "Product Variant 1",
            sellingPrice: "100.00",
            stock: 50,
            isAvailable: true
          }
        ],
        stock: 50,
        isInWishlist: false
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: "Product not found",
    example: {
      success: false,
      message: "Product not found"
    }
  })
  async getProductDetails(
    @Param("id", ParseUUIDPipe) productId: string,
    @Request() req
  ) {
    // Try to get user ID from JWT token if available
    let userId = null;
    try {
      if (req.user) {
        userId = req.user.id;
      }
    } catch (error) {
      // User not authenticated, continue without user data
    }

    return this.productsService.getProductDetails(productId, userId);
  }

  @Get("variable/:id")
  async getProductVariable(@Param("id", ParseUUIDPipe) productId: string) {
    return this.productsService.getProductVariable(productId);
  }

  @Post("variable")
  async getVariableProduct(
    @Body() getVariableProductDto: GetVariableProductDto
  ) {
    return this.productsService.getVariableProduct(
      getVariableProductDto.productId,
      getVariableProductDto.attributes
    );
  }

  @Get("related/:id")
  async getRelatedProducts(
    @Param("id", ParseUUIDPipe) productId: string,
    @Query("limit") limit?: number
  ) {
    return this.productsService.getRelatedProducts(
      productId,
      limit ? parseInt(limit.toString()) : 8
    );
  }

  @Get("reviews/:id")
  async getProductReviews(
    @Param("id", ParseUUIDPipe) productId: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.productsService.getProductReviews(
      productId,
      page ? parseInt(page.toString()) : 1,
      limit ? parseInt(limit.toString()) : 10
    );
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("reviews")
  async storeReview(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    return this.productsService.storeReview(req.user.id, createReviewDto);
  }

  @Get("stock/:id")
  async getProductStock(@Param("id", ParseUUIDPipe) productId: string) {
    return this.productsService.getProductStock(productId);
  }

  @Get("search")
  async searchProducts(
    @Query("q") query?: string,
    @Query("categoryId") categoryId?: string,
    @Query("groupId") groupId?: string,
    @Query("brandId") brandId?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    const filters: any = {};
    if (categoryId) filters.categoryId = categoryId;
    if (groupId) filters.groupId = groupId;
    if (brandId) filters.brandId = brandId;

    return this.productsService.searchProducts(
      query,
      filters,
      page ? parseInt(page.toString()) : 1,
      limit ? parseInt(limit.toString()) : 20
    );
  }
}
