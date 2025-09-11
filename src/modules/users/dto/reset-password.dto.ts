import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({
    description: "Contact number or email of the user",
    example: "+1234567890"
  })
  @IsString()
  @IsNotEmpty()
  contact: string;

  @ApiProperty({
    description: "Reset token received via email or SMS",
    example: "123456"
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: "New password for the account",
    example: "newpassword123"
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
