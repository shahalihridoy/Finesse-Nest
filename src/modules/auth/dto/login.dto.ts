import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({
    description: "Contact number or email used for login",
    example: "+1234567890"
  })
  @IsString()
  @IsNotEmpty()
  contact: string;

  @ApiProperty({
    description: "Password for the user account",
    example: "password123"
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
