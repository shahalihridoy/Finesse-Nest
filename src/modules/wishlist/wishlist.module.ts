import { Module } from "@nestjs/common";
import { HelperService } from "../../common/services/helper.service";
import { DatabaseModule } from "../../database/database.module";
import { WishlistController } from "./wishlist.controller";
import { WishlistService } from "./wishlist.service";

@Module({
  imports: [DatabaseModule],
  controllers: [WishlistController],
  providers: [WishlistService, HelperService],
  exports: [WishlistService]
})
export class WishlistModule {}
