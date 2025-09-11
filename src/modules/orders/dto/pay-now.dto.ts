import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class PayNowDto {
  @ApiProperty({
    description: "Payment method for the transaction",
    example: "credit_card",
    required: false
  })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiProperty({
    description: "Transaction ID from payment gateway",
    example: "txn_123456789",
    required: false
  })
  @IsOptional()
  @IsString()
  transactionId?: string;
}
