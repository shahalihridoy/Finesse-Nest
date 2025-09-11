import { Controller } from "@nestjs/common";
import { UploadService } from "./upload.service";

@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // Placeholder for upload endpoints
  // This would implement the same routes as the original file upload methods
}
