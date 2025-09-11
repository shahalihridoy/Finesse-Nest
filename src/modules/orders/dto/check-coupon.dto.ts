import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CheckCouponDto {
  @ApiProperty({
    description: "Coupon code to validate",
    example: "SAVE20"
  })
  @IsString()
  couponCode: string;

  @ApiProperty({
    description: "Total order amount to check coupon validity",
    example: 150.0
  })
  @IsNumber()
  orderAmount: number;
}
