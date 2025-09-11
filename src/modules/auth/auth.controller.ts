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
  @ApiResponse({ status: 201, description: "User successfully registered" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  @ApiOperation({ summary: "Login user" })
  @ApiResponse({ status: 200, description: "User successfully logged in" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
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
}
