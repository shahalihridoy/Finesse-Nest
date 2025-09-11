import { Module } from "@nestjs/common";
import { CommonModule } from "../../common/common.module";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";

@Module({
  imports: [CommonModule],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService]
})
export class CartModule {}
