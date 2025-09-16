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
import { PreorderService } from "./preorder.service";

@Controller("preorder")
export class PreorderController {
  constructor(private readonly preorderService: PreorderService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("cart")
  async showPreorderCart(@Request() req) {
    return this.preorderService.showPreorderCart(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("cart")
  async storePreorderCart(@Request() req, @Body() cartData: any) {
    return this.preorderService.storePreorderCart(req.user.id, cartData);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("cart/:id")
  async updatePreorderCart(
    @Request() req,
    @Param("id", ParseUUIDPipe) cartId: string,
    @Body() updateData: any
  ) {
    return this.preorderService.updatePreorderCart(
      req.user.id,
      cartId,
      updateData
    );
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("cart/:id")
  async deletePreorderCart(
    @Request() req,
    @Param("id", ParseUUIDPipe) cartId: string
  ) {
    return this.preorderService.deletePreorderCart(req.user.id, cartId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("orders")
  async showPreorderOrders(
    @Request() req,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("status") status?: string
  ) {
    return this.preorderService.showPreorderOrders(
      req.user.id,
      page ? parseInt(page.toString()) : 1,
      limit ? parseInt(limit.toString()) : 10,
      status || "All"
    );
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("orders/:id")
  async showSinglePreorder(
    @Request() req,
    @Param("id", ParseUUIDPipe) orderId: string
  ) {
    return this.preorderService.showSinglePreorder(req.user.id, orderId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("orders")
  async storePreorder(@Request() req, @Body() orderData: any) {
    return this.preorderService.storePreorder(req.user.id, orderData);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("orders/app")
  async storeAppPreorder(@Request() req, @Body() orderData: any) {
    return this.preorderService.storeAppPreorder(req.user.id, orderData);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("orders/:id/cancel")
  async cancelPreorder(
    @Request() req,
    @Param("id", ParseUUIDPipe) orderId: string
  ) {
    return this.preorderService.cancelPreorder(req.user.id, orderId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("orders/:id/pay")
  async payNowPreorder(
    @Request() req,
    @Param("id", ParseUUIDPipe) orderId: string,
    @Body() paymentData: any
  ) {
    return this.preorderService.payNowPreorder(
      req.user.id,
      orderId,
      paymentData
    );
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("orders/:id/clear-payment")
  async clearPreorderPayment(
    @Request() req,
    @Param("id", ParseUUIDPipe) orderId: string
  ) {
    return this.preorderService.clearPreorderPayment(req.user.id, orderId);
  }
}
