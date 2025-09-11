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
import { CheckCouponDto } from "./dto/check-coupon.dto";
import { CheckGiftVoucherDto } from "./dto/check-gift-voucher.dto";
import { CreateOrderDto } from "./dto/create-order.dto";
import { PayNowDto } from "./dto/pay-now.dto";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  async showOrders(
    @Request() req,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.ordersService.showOrders(
      req.user.id,
      page ? parseInt(page.toString()) : 1,
      limit ? parseInt(limit.toString()) : 10
    );
  }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  async storeOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.storeOrder(req.user.id, createOrderDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("app")
  async storeAppOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.storeAppOrder(req.user.id, createOrderDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post(":id/cancel")
  async cancelOrder(
    @Request() req,
    @Param("id", ParseIntPipe) orderId: number
  ) {
    return this.ordersService.cancelOrder(req.user.id, orderId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post(":id/pay")
  async payNow(
    @Request() req,
    @Param("id", ParseIntPipe) orderId: number,
    @Body() payNowDto: PayNowDto
  ) {
    return this.ordersService.payNow(req.user.id, orderId, payNowDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post(":id/clear-payment")
  async clearPayment(
    @Request() req,
    @Param("id", ParseIntPipe) orderId: number
  ) {
    return this.ordersService.clearPayment(req.user.id, orderId);
  }

  @Get("check-stock")
  async checkStock(
    @Query("productId", ParseIntPipe) productId: number,
    @Query("quantity", ParseIntPipe) quantity: number
  ) {
    return this.ordersService.checkStock(productId, quantity);
  }

  @Post("check-coupon")
  async checkCoupon(@Body() checkCouponDto: CheckCouponDto) {
    return this.ordersService.checkCoupon(
      checkCouponDto.couponCode,
      checkCouponDto.orderAmount
    );
  }

  @Post("check-referral-code")
  async checkReferralCode(@Body("referralCode") referralCode: string) {
    return this.ordersService.checkReferralCode(referralCode);
  }

  @Post("check-gift-voucher")
  async checkGiftVoucher(@Body() checkGiftVoucherDto: CheckGiftVoucherDto) {
    return this.ordersService.checkGiftVoucherCode(
      checkGiftVoucherDto.giftVoucherCode
    );
  }

  @Get("cities")
  async getCities() {
    return this.ordersService.getCities();
  }

  @Get("zones")
  async getZones() {
    return this.ordersService.getZones();
  }

  @Get("areas/:zoneId")
  async getZoneAreas(@Param("zoneId", ParseIntPipe) zoneId: number) {
    return this.ordersService.getZoneAreas(zoneId);
  }
}
