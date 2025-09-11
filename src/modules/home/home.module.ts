import { Module } from "@nestjs/common";
import { CommonModule } from "../../common/common.module";
import { HomeController } from "./home.controller";
import { HomeService } from "./home.service";

@Module({
  imports: [CommonModule],
  providers: [HomeService],
  controllers: [HomeController],
  exports: [HomeService]
})
export class HomeModule {}
