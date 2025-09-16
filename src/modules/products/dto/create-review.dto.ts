import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min
} from "class-validator";

export class CreateReviewDto {
  @ApiProperty({
    description: "ID of the product being reviewed",
    example: "550e8400-e29b-41d4-a716-446655440000"
  })
  @IsString()
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: "Rating for the product (1-5 stars)",
    example: 5,
    minimum: 1,
    maximum: 5
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: "Optional review comment",
    example: "Great product! Highly recommended.",
    required: false
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    description: "Optional array of image URLs for the review",
    example: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    required: false,
    type: [String]
  })
  @IsOptional()
  @IsArray()
  images?: string[];
}
