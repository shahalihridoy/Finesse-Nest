import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsObject, IsOptional, Min } from "class-validator";

export class AddToCartDto {
  @ApiProperty({
    description: "ID of the main product (optional)",
    example: 789,
    required: false
  })
  @IsOptional()
  @IsNumber()
  mproductId?: number;

  @ApiProperty({
    description: "ID of the product to add to cart",
    example: 123,
    required: false
  })
  @IsOptional()
  @IsNumber()
  productId?: number;

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
