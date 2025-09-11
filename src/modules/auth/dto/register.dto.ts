import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({
    description: "Full name of the user",
    example: "John Doe"
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Email address of the user",
    example: "john.doe@example.com"
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Contact number of the user",
    example: "+1234567890"
  })
  @IsString()
  @IsNotEmpty()
  contact: string;

  @ApiProperty({
    description: "Password for the user account (minimum 6 characters)",
    example: "password123",
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;
}
