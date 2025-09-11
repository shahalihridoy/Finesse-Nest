import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import { ContactUsDto } from "./dto/contact-us.dto";
import { CreateReportDto } from "./dto/create-report.dto";
import { HomeService } from "./home.service";

@ApiTags("Home")
@Controller("home")
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get("top-promotional-sliders")
  async getAllTopPromotionalSliders() {
    return this.homeService.getAllTopPromotionalSliders();
  }

  @Get("front-sliders")
  async getAllFrontSliders() {
    return this.homeService.getAllFrontSliders();
  }

  @Get("landing-products")
  async getLandingProducts() {
    return this.homeService.getLandingProducts();
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("reports")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new report" })
  @ApiResponse({ status: 201, description: "Report created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async storeReports(@Request() req, @Body() createReportDto: CreateReportDto) {
    return this.homeService.storeReports(req.user.id, createReportDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("reports")
  async getAllReports(
    @Request() req,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.homeService.getAllReports(
      req.user.id,
      page ? parseInt(page.toString()) : 1,
      limit ? parseInt(limit.toString()) : 5
    );
  }

  @Get("faq")
  async getAllFaq(
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.homeService.getAllFaq(
      page ? parseInt(page.toString()) : 1,
      limit ? parseInt(limit.toString()) : 5
    );
  }

  @Get("settings")
  async getSettings() {
    return this.homeService.getSettings();
  }

  @Get("policy-page/:name")
  async getPolicyPage(@Param("name") routeName: string) {
    return this.homeService.getPolicyPage(routeName);
  }

  @Post("contact-us")
  @ApiOperation({ summary: "Send a contact us message" })
  @ApiResponse({
    status: 201,
    description: "Contact message sent successfully"
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  async storeContactUs(@Body() contactUsDto: ContactUsDto) {
    return this.homeService.storeContactUs(contactUsDto);
  }

  @Post("upload-review-file")
  @UseInterceptors(FileInterceptor("file"))
  async uploadReviewFile(@UploadedFile() file: Express.Multer.File) {
    return this.homeService.uploadReviewFile(file);
  }

  @Get("test")
  async test() {
    return this.homeService.test();
  }

  @Get("ims/:id")
  async getAllImagesForMainProduct(@Param("id") productId: string) {
    return this.homeService.getAllImagesForMainProduct();
  }
}
