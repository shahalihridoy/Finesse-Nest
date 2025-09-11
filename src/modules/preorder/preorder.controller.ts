import { Controller } from "@nestjs/common";
import { PreorderService } from "./preorder.service";

@Controller("preorder")
export class PreorderController {
  constructor(private readonly preorderService: PreorderService) {}

  // Placeholder for preorder endpoints
  // This would implement the same routes as the original PreorderController
}
