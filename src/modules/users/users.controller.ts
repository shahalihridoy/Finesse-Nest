import {
  Body,
  Controller,
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
import { GetResetMessageDto } from "./dto/get-reset-message.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { SendResetMessageDto } from "./dto/send-reset-message.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("profile")
  async getUser(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("profile")
  async updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(req.user.id, updateUserDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("password")
  async updatePassword(
    @Request() req,
    @Body() updatePasswordDto: UpdatePasswordDto
  ) {
    return this.usersService.updatePassword(
      req.user.id,
      updatePasswordDto.password
    );
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("customers")
  async getCustomers() {
    return this.usersService.getCustomers();
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("balance-details")
  async getUserBalanceDetails(@Request() req) {
    return this.usersService.getUserBalanceDetails(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("outstanding-customer")
  async getOutstandingCustomer(@Request() req) {
    return this.usersService.getOutstandingCustomer(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("notifications/count")
  async getNotificationCount(@Request() req) {
    return this.usersService.getNotificationCount(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("notifications")
  async getNotificationDetails(@Request() req, @Query("limit") limit?: number) {
    return this.usersService.getNotificationDetails(req.user.id, limit);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("notifications/:id/update")
  async updateNotification(
    @Request() req,
    @Param("id", ParseUUIDPipe) notificationId: string
  ) {
    return this.usersService.updateNotification(req.user.id, notificationId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("notifications/update-all")
  async updateAllNotifications(@Request() req) {
    return this.usersService.updateAllNotifications(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("notifications/:id/delete")
  async deleteNotification(
    @Request() req,
    @Param("id", ParseUUIDPipe) notificationId: string
  ) {
    return this.usersService.deleteNotification(req.user.id, notificationId);
  }

  @Get("init-data")
  async getInitData(@Request() req) {
    // Try to get user from JWT token if available
    let userId = null;
    try {
      if (req.user) {
        userId = req.user.id;
      }
    } catch (error) {
      // User not authenticated, continue without user data
    }

    return this.usersService.getInitData(userId);
  }

  @Post("send-reset-message")
  async sendResetMessage(@Body() sendResetMessageDto: SendResetMessageDto) {
    // This would be implemented in AuthService
    return { message: "Reset message functionality to be implemented" };
  }

  @Post("get-reset-message")
  async getResetMessage(@Body() getResetMessageDto: GetResetMessageDto) {
    // This would be implemented in AuthService
    return { message: "Get reset message functionality to be implemented" };
  }

  @Post("reset-password")
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    // This would be implemented in AuthService
    return { message: "Reset password functionality to be implemented" };
  }
}
