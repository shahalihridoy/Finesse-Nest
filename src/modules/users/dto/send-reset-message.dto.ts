import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SendResetMessageDto {
  @ApiProperty({
    description: "Contact number or email to send reset message to",
    example: "+1234567890"
  })
  @IsString()
  @IsNotEmpty()
  contact: string;
}
