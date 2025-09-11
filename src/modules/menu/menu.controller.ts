import { Controller, Get, Param } from "@nestjs/common";
import { MenuService } from "./menu.service";

@Controller("menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get("all")
  async getAllMenus() {
    return this.menuService.getAllMenus();
  }

  @Get("front-sliders/:name")
  async getMenuFrontSliders(@Param("name") menuName: string) {
    return this.menuService.getMenuFrontSliders(menuName);
  }
}
