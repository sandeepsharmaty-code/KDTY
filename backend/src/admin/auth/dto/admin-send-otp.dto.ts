import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AdminSendOtpDto {
  @ApiProperty()
  @IsString()
  phoneNumber!: string;
}
