import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateReportDto {
  @ApiProperty({
    description: "Type of the report",
    example: "bug_report"
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: "Title of the report",
    example: "Login issue on mobile app"
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Detailed description of the report",
    example:
      "Users are unable to login using their credentials on the mobile application. The login button does not respond when tapped."
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
