import Shurjopay, { PaymentResponse, VerificationResponse } from 'shurjopay';
import config from '../../config';

const shurjopay = new Shurjopay();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const paymentResult = async (paymentPayload: any, platform: 'web' | 'mobile'): Promise<PaymentResponse> => {
  // Dynamically set return URL based on platform
  const returnUrl =
    platform === 'mobile' ? config.sp.sp_return_url_mobile! : config.sp.sp_return_url_web!;

  // Set ShurjoPay config dynamically
  shurjopay.config(
    config.sp.sp_endpoint!,
    config.sp.sp_username!,
    config.sp.sp_password!,
    config.sp.sp_prefix!,
    returnUrl,
  );

  return await new Promise((resolve, reject) => {
    shurjopay.makePayment(
      paymentPayload,
      (response) => resolve(response),
      (error) => reject(error),
    );
  });
};

const verifyPaymentAsync = (
  order_id: string,
): Promise<VerificationResponse[]> => {
  return new Promise((resolve, reject) => {
    shurjopay.verifyPayment(
      order_id,
      (response) => resolve(response),
      (error) => {
        reject(error);
      },
    );
  });
};

export const orderUtils = {
  paymentResult,
  verifyPaymentAsync,
};
