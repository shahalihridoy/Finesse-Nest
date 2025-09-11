import { ApiProperty } from "@nestjs/swagger";
import { IsObject, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({
    description: "Updated name of the user",
    example: "John Smith",
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: "Updated email address",
    example: "john.smith@example.com",
    required: false
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: "Updated contact number",
    example: "+1234567890",
    required: false
  })
  @IsOptional()
  @IsString()
  contact?: string;

  @ApiProperty({
    description: "Customer profile information",
    example: {
      address: "123 Main St",
      city: "New York",
      preferences: ["electronics", "books"]
    },
    required: false
  })
  @IsOptional()
  @IsObject()
  customer?: any;

  @ApiProperty({
    description: "Password change information",
    example: {
      oldPassword: "oldpassword123",
      password: "newpassword123"
    },
    required: false
  })
  @IsOptional()
  @IsObject()
  password?: {
    oldPassword: string;
    password: string;
  };
}
