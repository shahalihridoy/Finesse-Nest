import { Module } from "@nestjs/common";
import { PreorderController } from "./preorder.controller";
import { PreorderService } from "./preorder.service";

@Module({
  providers: [PreorderService],
  controllers: [PreorderController],
  exports: [PreorderService]
})
export class PreorderModule {}
