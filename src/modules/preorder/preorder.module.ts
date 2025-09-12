import { Module } from "@nestjs/common";
import { CommonModule } from "../../common/common.module";
import { DatabaseModule } from "../../database/database.module";
import { PreorderController } from "./preorder.controller";
import { PreorderService } from "./preorder.service";

@Module({
  imports: [DatabaseModule, CommonModule],
  providers: [PreorderService],
  controllers: [PreorderController],
  exports: [PreorderService]
})
export class PreorderModule {}
