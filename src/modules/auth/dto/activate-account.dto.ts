import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ActivateAccountDto {
  @ApiProperty({
    description: "Email address of the user to activate",
    example: "john.doe@example.com"
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Activation token received via email or SMS",
    example: "123456"
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
