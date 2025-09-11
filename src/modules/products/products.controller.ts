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
import { CreateReviewDto } from "./dto/create-review.dto";
import { GetVariableProductDto } from "./dto/get-variable-product.dto";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get("details/:id")
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
