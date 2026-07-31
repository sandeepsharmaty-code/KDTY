import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AdminUserEntity } from "./entities/admin-user.entity";
import { verifyPassword } from "@/modules/auth/password.util";
import { AuditLogService } from "@/admin/audit/audit-log.service";
import { OtpService } from "@/integrations/sms/otp.service";
import { SmsService } from "@/integrations/sms/sms.service";
import { MockSmsProvider } from "@/integrations/sms/providers/mock-sms.provider";

const ADMIN_OTP_PURPOSE = "admin_login";

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(AdminUserEntity) private readonly adminUsers: Repository<AdminUserEntity>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly auditLog: AuditLogService,
    private readonly otp: OtpService,
    private readonly sms: SmsService,
  ) {}

  async login(email: string, password: string): Promise<{ sessionToken: string; role: string; expiresAt: Date }> {
    const user = await this.adminUsers.findOne({ where: { email } });
    const isValid = Boolean(user?.active) && (await verifyPassword(password, user?.passwordHash ?? ""));

    await this.auditLog.record({
      actorId: user?.id ?? "unknown",
      actorEmail: email,
      module: "auth",
      action: isValid ? "login_success" : "login_failure",
    });

    if (!isValid || !user) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    return this.issueSession(user);
  }

  async sendOtp(phoneNumber: string): Promise<{ sent: true; devOtp?: string }> {
    const user = await this.adminUsers.findOne({ where: { phoneNumber, active: true } });
    if (!user) return { sent: true };

    const code = await this.sms.sendOtpForPurpose(
      phoneNumber,
      ADMIN_OTP_PURPOSE,
      "Your Hue Muse Beauty admin login code is {code}. It expires in 5 minutes.",
    );
    if (this.sms.getProvider() instanceof MockSmsProvider) {
      return { sent: true, devOtp: code };
    }
    return { sent: true };
  }

  async verifyOtp(phoneNumber: string, code: string): Promise<{ sessionToken: string; role: string; expiresAt: Date }> {
    const user = await this.adminUsers.findOne({ where: { phoneNumber, active: true } });
    const isValid = Boolean(user) && (await this.otp.verify(phoneNumber, ADMIN_OTP_PURPOSE, code));

    await this.auditLog.record({
      actorId: user?.id ?? "unknown",
      actorEmail: user?.email ?? phoneNumber,
      module: "auth",
      action: isValid ? "login_success" : "login_failure",
    });

    if (!isValid || !user) {
      throw new UnauthorizedException("Invalid or expired code.");
    }

    return this.issueSession(user);
  }

  private async issueSession(user: AdminUserEntity): Promise<{ sessionToken: string; role: string; expiresAt: Date }> {
    user.lastLoginAt = new Date();
    await this.adminUsers.save(user);

    const sessionToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email, role: user.role },
      { secret: this.config.get<string>("jwt.secret"), expiresIn: this.config.get<string>("jwt.accessTokenTtl") },
    );
    return { sessionToken, role: user.role, expiresAt: new Date(Date.now() + 15 * 60 * 1000) };
  }
}
