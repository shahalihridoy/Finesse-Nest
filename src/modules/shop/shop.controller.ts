import { Controller, Get, Param } from "@nestjs/common";
import { ShopService } from "./shop.service";

@Controller("shop")
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get("colors")
  async getAllColors() {
    return this.shopService.getAllColors();
  }

  @Get("groups")
  async getAllGroups() {
    return this.shopService.getAllGroups();
  }

  @Get("groups/:name")
  async getMenuGroups(@Param("name") menuName: string) {
    return this.shopService.getMenuGroups(menuName);
  }

  @Get("page-data")
  async getShopPageData() {
    return this.shopService.getShopPageData();
  }

  @Get("sale-page-data")
  async getSalePageData() {
    return this.shopService.getSalePageData();
  }

  @Get("screen-data")
  async getShopScreenData() {
    return this.shopService.getShopScreenData();
  }

  @Get("sale-screen-data")
  async getSaleScreenData() {
    return this.shopService.getSaleScreenData();
  }

  @Get("tags")
  async getAllTags() {
    return this.shopService.getAllTags();
  }

  @Get("brands")
  async getAllBrands() {
    return this.shopService.getAllBrands();
  }
}
