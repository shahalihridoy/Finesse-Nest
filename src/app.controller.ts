import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  getHello(): { greeting: string } {
    return { greeting: "Hello world in JSON" };
  }
}
