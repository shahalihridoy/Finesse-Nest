import { Module } from "@nestjs/common";
import { ShopController } from "./shop.controller";
import { ShopService } from "./shop.service";

@Module({
  providers: [ShopService],
  controllers: [ShopController],
  exports: [ShopService]
})
export class ShopModule {}
