import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ContactUsDto {
  @ApiProperty({
    description: "Full name of the person contacting",
    example: "John Doe"
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Email address for contact",
    example: "john.doe@example.com"
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Phone number (optional)",
    example: "+1234567890",
    required: false
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: "Subject of the contact message (optional)",
    example: "Product inquiry",
    required: false
  })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({
    description: "Contact message content",
    example:
      "I would like to know more about your premium products and pricing options. Please contact me at your earliest convenience."
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
