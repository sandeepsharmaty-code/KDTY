import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AdminVerifyOtpDto {
  @ApiProperty()
  @IsString()
  phoneNumber!: string;

  @ApiProperty()
  @IsString()
  code!: string;
}
