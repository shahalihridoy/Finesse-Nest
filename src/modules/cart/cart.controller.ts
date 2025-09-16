import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CartService } from "./cart.service";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";

@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  async showCarts(
    @Request() req,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.cartService.showCarts(
      req.user.id,
      page ? parseInt(page.toString()) : 1,
      limit ? parseInt(limit.toString()) : 10
    );
  }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  async storeCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.storeCart(req.user.id, addToCartDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("app")
  async storeAppCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.storeAppCart(req.user.id, addToCartDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put(":id")
  async updateCart(
    @Request() req,
    @Param("id", ParseUUIDPipe) cartId: string,
    @Body() updateCartDto: UpdateCartDto
  ) {
    return this.cartService.updateCart(req.user.id, cartId, updateCartDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  async deleteCart(@Request() req, @Param("id", ParseUUIDPipe) cartId: string) {
    return this.cartService.deleteCart(req.user.id, cartId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete()
  async clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("count")
  async getCartCount(@Request() req) {
    return this.cartService.getCartCount(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("total")
  async getCartTotal(@Request() req) {
    return this.cartService.getCartTotal(req.user.id);
  }
}
