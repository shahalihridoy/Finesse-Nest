import { Module } from "@nestjs/common";
import { MenuController } from "./menu.controller";
import { MenuService } from "./menu.service";

@Module({
  providers: [MenuService],
  controllers: [MenuController],
  exports: [MenuService]
})
export class MenuModule {}
