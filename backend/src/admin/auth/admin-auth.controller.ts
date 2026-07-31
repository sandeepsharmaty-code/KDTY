import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { AdminAuthService } from "./admin-auth.service";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { AdminSendOtpDto } from "./dto/admin-send-otp.dto";
import { AdminVerifyOtpDto } from "./dto/admin-verify-otp.dto";
import { Public } from "@/common/decorators/public.decorator";

@ApiTags("admin-auth")
@Controller({ path: "admin/auth", version: "1" })
export class AdminAuthController {
  constructor(private readonly adminAuth: AdminAuthService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(@Body() dto: AdminLoginDto) {
    return this.adminAuth.login(dto.email, dto.password);
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @Post("otp/send")
  sendOtp(@Body() dto: AdminSendOtpDto) {
    return this.adminAuth.sendOtp(dto.phoneNumber);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @Post("otp/verify")
  verifyOtp(@Body() dto: AdminVerifyOtpDto) {
    return this.adminAuth.verifyOtp(dto.phoneNumber, dto.code);
  }
}
