import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class SmsService {
  private readonly SMS_API_KEY = "kf6ixy21o5mOIreG22Nd";
  private readonly SENDER_ID = "8809617619675";

  /**
   * Send SMS - maintains exact same logic as original sendSms method
   */
  async sendSms(phoneNumber: string, message: string): Promise<boolean> {
    try {
      // Exact same implementation as original UserController.js lines 70-87
      const dataObj = {
        number: phoneNumber,
        username: "01998685230",
        password: "HADGZ9FT",
        message: message
      };

      const url = `http://bulksmsbd.net/api/smsapi?api_key=${this.SMS_API_KEY}&type=text&number=${dataObj.number}&senderid=${this.SENDER_ID}&message=${dataObj.message}`;

      const response = await axios.post(url, null, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      console.log("SMS Response:", response.data);
      return true;
    } catch (error) {
      console.error("SMS sending failed:", error);
      return false;
    }
  }

  /**
   * Send OTP SMS - maintains exact same logic as original sendOtpSms method
   */
  async sendOtpSms(phoneNumber: string, otp: string): Promise<boolean> {
    const message = `Your OTP is: ${otp}. Please use this code to verify your account.`;
    return this.sendSms(phoneNumber, message);
  }

  /**
   * Send password reset SMS - maintains exact same logic as original sendPasswordResetSms method
   */
  async sendPasswordResetSms(
    phoneNumber: string,
    resetCode: string
  ): Promise<boolean> {
    const message = `Your password reset code is: ${resetCode}. Please use this code to reset your password.`;
    return this.sendSms(phoneNumber, message);
  }

  /**
   * Send order confirmation SMS - maintains exact same logic as original sendOrderConfirmationSms method
   */
  async sendOrderConfirmationSms(
    phoneNumber: string,
    orderNo: string
  ): Promise<boolean> {
    const message = `Your order ${orderNo} has been confirmed. Thank you for your purchase!`;
    return this.sendSms(phoneNumber, message);
  }

  /**
   * Send order status update SMS - maintains exact same logic as original sendOrderStatusUpdateSms method
   */
  async sendOrderStatusUpdateSms(
    phoneNumber: string,
    orderNo: string,
    status: string
  ): Promise<boolean> {
    const message = `Your order ${orderNo} status has been updated to: ${status}`;
    return this.sendSms(phoneNumber, message);
  }
}
