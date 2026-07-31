import { Inject, Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { SMS_PROVIDER, type SmsProvider } from "./sms-provider.interface";
import { OtpService } from "./otp.service";
import { QUEUE_NAMES } from "@/integrations/queue/queue.constants";
import { DomainErrorCode, DomainException } from "@/common/exceptions/domain.exception";

@Injectable()
export class SmsService {
  constructor(
    @Inject(SMS_PROVIDER) private readonly provider: SmsProvider,
    @InjectQueue(QUEUE_NAMES.SMS) private readonly smsQueue: Queue,
    private readonly otp: OtpService,
  ) {}

  private async enqueue(to: string, message: string): Promise<void> {
    await this.smsQueue.add("send-sms", { to, message });
  }

  async sendLoginOtp(phoneNumber: string): Promise<void> {
    const code = await this.otp.generate(phoneNumber, "login");
    await this.enqueue(phoneNumber, `Your Hue Muse Beauty login code is ${code}. It expires in 5 minutes.`);
  }

  async verifyLoginOtp(phoneNumber: string, code: string): Promise<boolean> {
    return this.otp.verify(phoneNumber, "login", code);
  }

  async sendOtpForPurpose(phoneNumber: string, purpose: string, message: string): Promise<void> {
    const code = await this.otp.generate(phoneNumber, purpose);
    await this.enqueue(phoneNumber, message.replace("{code}", code));
  }

  async sendOrderConfirmationSms(phoneNumber: string, orderId: string): Promise<void> {
    await this.enqueue(phoneNumber, `Your Hue Muse Beauty order #${orderId} is confirmed.`);
  }

  async sendDeliveryNotification(phoneNumber: string, orderId: string): Promise<void> {
    await this.enqueue(phoneNumber, `Your Hue Muse Beauty order #${orderId} has been delivered!`);
  }

  getProvider(): SmsProvider {
    return this.provider;
  }
}
