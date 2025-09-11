import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePasswordDto {
  @ApiProperty({
    description: "New password for the user account",
    example: "newpassword123"
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
