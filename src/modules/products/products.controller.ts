import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
  @ApiParam({ name: "id", description: "Product ID", type: "number" })
  @ApiResponse({
    status: 200,
    description: "Product details retrieved successfully",
    example: {
      success: true,
      product: {
        id: 1,
        name: "Sample Product",
        description: "This is a sample product description",
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
        products: [
          {
            id: 1,
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
    @Param("id", ParseIntPipe) productId: number,
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
  async getProductVariable(@Param("id", ParseIntPipe) productId: number) {
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
    @Param("id", ParseIntPipe) productId: number,
    @Query("limit") limit?: number
  ) {
    return this.productsService.getRelatedProducts(
      productId,
      limit ? parseInt(limit.toString()) : 8
    );
  }

  @Get("reviews/:id")
  async getProductReviews(
    @Param("id", ParseIntPipe) productId: number,
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
  async getProductStock(@Param("id", ParseIntPipe) productId: number) {
    return this.productsService.getProductStock(productId);
  }

  @Get("search")
  async searchProducts(
    @Query("q") query?: string,
    @Query("categoryId") categoryId?: number,
    @Query("groupId") groupId?: number,
    @Query("brandId") brandId?: number,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    const filters: any = {};
    if (categoryId) filters.categoryId = parseInt(categoryId.toString());
    if (groupId) filters.groupId = parseInt(groupId.toString());
    if (brandId) filters.brandId = parseInt(brandId.toString());

    return this.productsService.searchProducts(
      query,
      filters,
      page ? parseInt(page.toString()) : 1,
      limit ? parseInt(limit.toString()) : 20
    );
  }
}
