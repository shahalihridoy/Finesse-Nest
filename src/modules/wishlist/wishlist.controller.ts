import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import { WishlistService } from "./wishlist.service";

@ApiTags("Wishlist")
@Controller("wishlist")
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user's wishlist" })
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
  @ApiResponse({
    status: 200,
    description: "Wishlist retrieved successfully",
    example: {
      success: true,
      wishlist: {
        data: [
          {
            id: 1,
            product: {
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
            },
            createdAt: "2023-12-09T00:00:00.000Z"
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 5,
          totalPages: 1
        }
      }
    }
  })
  async showWishlist(
    @Request() req,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.wishlistService.showWishlist(
      req.user.id,
      page ? parseInt(page.toString()) : 1,
      limit ? parseInt(limit.toString()) : 10
    );
  }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  async storeWishlist(
    @Request() req,
    @Body("productId", ParseIntPipe) productId: number
  ) {
    return this.wishlistService.storeWishlist(req.user.id, productId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put(":id")
  async updateWishlist(
    @Request() req,
    @Param("id", ParseIntPipe) wishlistId: number,
    @Body() updateData: any
  ) {
    return this.wishlistService.updateWishlist(
      req.user.id,
      wishlistId,
      updateData
    );
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  async deleteWishlist(
    @Request() req,
    @Param("id", ParseIntPipe) wishlistId: number
  ) {
    return this.wishlistService.deleteWishlist(req.user.id, wishlistId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("count")
  async getWishlistCount(@Request() req) {
    const count = await this.wishlistService.getWishlistCount(req.user.id);
    return {
      success: true,
      count: count
    };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("check/:productId")
  async checkWishlistStatus(
    @Request() req,
    @Param("productId", ParseIntPipe) productId: number
  ) {
    const isInWishlist = await this.wishlistService.isInWishlist(
      req.user.id,
      productId
    );
    return {
      success: true,
      isInWishlist: isInWishlist
    };
  }
}
