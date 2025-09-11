import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GetResetMessageDto {
  @ApiProperty({
    description: "Email address of the user",
    example: "john.doe@example.com"
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Reset token received via email or SMS",
    example: "123456"
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
