import { Module } from "@nestjs/common";
import { CommonModule } from "../../common/common.module";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

@Module({
  imports: [CommonModule],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService]
})
export class ProductsModule {}
