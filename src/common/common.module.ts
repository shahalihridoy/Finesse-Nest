import { Module } from "@nestjs/common";
import { HelperService } from "./services/helper.service";
import { SmsService } from "./services/sms.service";

@Module({
  providers: [HelperService, SmsService],
  exports: [HelperService, SmsService]
})
export class CommonModule {}
