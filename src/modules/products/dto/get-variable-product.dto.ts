import { ApiProperty } from "@nestjs/swagger";
import { IsObject, IsString, IsUUID } from "class-validator";

export class GetVariableProductDto {
  @ApiProperty({
    description: "ID of the variable product",
    example: "550e8400-e29b-41d4-a716-446655440000"
  })
  @IsString()
  @IsUUID()
  productId: string;

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
