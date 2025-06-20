// src/lib/payunit.ts
import axios from "axios";

export const PAYUNIT_CONFIG = {
  BASE_URL: "https://gateway.payunit.net",
  API_TOKEN: "live_KBBGqTTzFmRzK8seDJCJDbD01jSUcXrWG0pSjxei",
  API_USER: "dc3787e7-68d2-458f-8512-fbabafbda045",
  API_PASSWORD: "8322491a-c31a-4ce9-8ee9-68e5ebdf19c8",
};

export const initializePayment = async (params: {
  amount: number;
  transactionId: string;
  successUrl: string;
  cancelUrl: string;
  description: string;
}) => {
  const credentials = btoa(`${PAYUNIT_CONFIG.API_USER}:${PAYUNIT_CONFIG.API_PASSWORD}`);
  
  const payload = {
    total_amount: params.amount,
    currency: "XAF",
    transaction_id: params.transactionId,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    mode: "payment",
    items: [{
      price_description: { unit_amount: params.amount },
      product_description: {
        name: "Team Subscription",
        about_product: params.description
      },
      quantity: 1
    }]
  };

  try {
    const response = await axios.post(
      `${PAYUNIT_CONFIG.BASE_URL}/api/gateway/checkout/initialize`,
      payload,
      {
        headers: {
          "x-api-key": PAYUNIT_CONFIG.API_TOKEN,
          mode: "live",
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        }
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("PayUnit initialization error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Payment initialization failed");
  }
};

// Add payment verification function
export const verifyPayment = async (transactionId: string) => {
  try {
    const credentials = btoa(`${PAYUNIT_CONFIG.API_USER}:${PAYUNIT_CONFIG.API_PASSWORD}`);
    
    const response = await axios.get(
      `${PAYUNIT_CONFIG.BASE_URL}/api/gateway/transaction/status/${transactionId}`,
      {
        headers: {
          "x-api-key": PAYUNIT_CONFIG.API_TOKEN,
          mode: "live",
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        }
      }
    );
    
    console.log("Payment verification response:", response.data);
    
    // Check if payment is successful
    return response.data && 
           response.data.status === 'success' && 
           response.data.data && 
           response.data.data.transaction_status === 'SUCCESSFUL';
  } catch (error: any) {
    console.error("Payment verification error:", error.response?.data || error.message);
    return false;
  }
};
