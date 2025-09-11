import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsObject, IsOptional, IsString } from "class-validator";

export class CreateOrderDto {
  @ApiProperty({
    description: "Payment method for the order",
    example: "credit_card",
    required: false
  })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiProperty({
    description: "Shipping cost for the order",
    example: 15.99,
    required: false
  })
  @IsOptional()
  @IsNumber()
  shippingCost?: number;

  @ApiProperty({
    description: "Coupon code for discount",
    example: "SAVE20",
    required: false
  })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiProperty({
    description: "Gift voucher code",
    example: "GIFT50",
    required: false
  })
  @IsOptional()
  @IsString()
  giftVoucherCode?: string;

  @ApiProperty({
    description: "Referral code for rewards",
    example: "REF123",
    required: false
  })
  @IsOptional()
  @IsString()
  referralCode?: string;

  @ApiProperty({
    description: "Shipping address and details",
    example: {
      name: "John Doe",
      address: "123 Main St",
      city: "New York",
      zipCode: "10001",
      phone: "+1234567890"
    },
    required: false
  })
  @IsOptional()
  @IsObject()
  shippingDetails?: any;

  @ApiProperty({
    description: "Additional notes for the order",
    example: "Please deliver after 5 PM",
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
