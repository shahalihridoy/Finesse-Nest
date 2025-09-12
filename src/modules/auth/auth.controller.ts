import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { ActivateAccountDto } from "./dto/activate-account.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { SendActivationCodeDto } from "./dto/send-activation-code.dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({
    status: 201,
    description: "User successfully registered",
    example: {
      success: true,
      message: "Registration Successful!",
      user: {
        id: 1,
        name: "John Doe",
        contact: "01987654321",
        email: "john@example.com",
        userType: "Customer",
        isActive: false,
        customer: {
          id: 1,
          customerName: "John Doe",
          contact: "01987654321",
          email: "john@example.com"
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    example: {
      success: false,
      message: "Invalid Contact Number"
    }
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  @ApiOperation({ summary: "Login user" })
  @ApiResponse({
    status: 200,
    description: "User successfully logged in",
    example: {
      success: true,
      message: "Login Successful !",
      user: {
        id: 1,
        name: "John Doe",
        contact: "01987654321",
        email: "john@example.com",
        userType: "Customer",
        isActive: true,
        customer: {
          id: 1,
          customerName: "John Doe",
          contact: "01987654321",
          email: "john@example.com"
        }
      },
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  })
  @ApiResponse({
    status: 401,
    description: "Invalid credentials",
    example: {
      success: false,
      message: "Invalid credentials"
    }
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("send-activation-code")
  @ApiOperation({ summary: "Send activation code to user" })
  @ApiResponse({
    status: 200,
    description: "Activation code sent successfully"
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  async sendActivationCode(
    @Body() sendActivationCodeDto: SendActivationCodeDto
  ) {
    return this.authService.sendActivationCode(sendActivationCodeDto.contact);
  }

  @Post("activate-account")
  @ApiOperation({ summary: "Activate user account" })
  @ApiResponse({ status: 200, description: "Account activated successfully" })
  @ApiResponse({ status: 400, description: "Invalid activation code" })
  async activateAccount(@Body() activateAccountDto: ActivateAccountDto) {
    return this.authService.activateAccount(
      activateAccountDto.email,
      activateAccountDto.token
    );
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("logout")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Logout user" })
  @ApiResponse({ status: 200, description: "User successfully logged out" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async logout(@Request() req) {
    // Extract token from request headers
    const token = req.headers.authorization?.replace("Bearer ", "");
    return this.authService.logout(token);
  }

  @Post("send-password-reset-code")
  @ApiOperation({ summary: "Send password reset code" })
  @ApiResponse({
    status: 200,
    description: "Password reset code sent successfully"
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  async sendPasswordResetCode(@Body("contact") contact: string) {
    return this.authService.sendPasswordResetCode(contact);
  }

  @Post("reset-password")
  @ApiOperation({ summary: "Reset password with code" })
  @ApiResponse({ status: 200, description: "Password reset successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async resetPassword(
    @Body("contact") contact: string,
    @Body("resetCode") resetCode: string,
    @Body("newPassword") newPassword: string
  ) {
    return this.authService.resetPassword(contact, resetCode, newPassword);
  }
}
