import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsObject } from "class-validator";

export class GetVariableProductDto {
  @ApiProperty({
    description: "ID of the variable product",
    example: 456
  })
  @IsNumber()
  productId: number;

  @ApiProperty({
    description: "Product attributes and variations",
    example: {
      color: "red",
      size: "large",
      material: "cotton"
    }
  })
  @IsObject()
  attributes: Record<string, any>;
}
