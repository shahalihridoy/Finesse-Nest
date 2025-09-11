import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CheckGiftVoucherDto {
  @ApiProperty({
    description: "Gift voucher code to validate",
    example: "GIFT50"
  })
  @IsString()
  giftVoucherCode: string;
}
