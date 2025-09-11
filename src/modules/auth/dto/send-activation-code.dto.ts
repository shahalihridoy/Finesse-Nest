import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SendActivationCodeDto {
  @ApiProperty({
    description: "Contact number or email to send activation code to",
    example: "+1234567890"
  })
  @IsString()
  @IsNotEmpty()
  contact: string;
}
