import { ApiProperty } from "@nestjs/swagger";
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min
} from "class-validator";

export class AddToCartDto {
  @ApiProperty({
    description: "ID of the main product (optional)",
    example: "550e8400-e29b-41d4-a716-446655440000",
    required: false
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  mproductId?: string;

  @ApiProperty({
    description: "ID of the product to add to cart",
    example: "550e8400-e29b-41d4-a716-446655440001",
    required: false
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  productId?: string;

  @ApiProperty({
    description: "Quantity of the product to add",
    example: 2,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: "Product details object (optional)",
    example: {
      name: "Sample Product",
      price: 29.99,
      variant: "red-large"
    },
    required: false
  })
  @IsOptional()
  @IsObject()
  product?: any;
}
