// src/app/api/payunit/route.ts
import axios, { AxiosRequestConfig } from "axios";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Check authentication first
    console.log("we are here");
    const authHeader = req.headers.get("authorization");
    const access_token = authHeader?.split(" ")[1]
   console.log("Access_token: ", access_token)

    if (!access_token) {
      return NextResponse.json({
        status: 401,
        message: 'Authentication required',
        success: false,
        redirect: '/login'
      }, { 
        status: 401 
      });
    }

    const body = await req.json();
    console.log("[POST] PayUnit Request Body:", body);
    
    const { 
      amount, 
      transactionId, 
      successUrl, 
      cancelUrl, 
      description 
    } = body;
    
    // Validate request parameters
    if (!amount || !transactionId || !successUrl || !cancelUrl) {
      console.log("[POST] Error: Missing required parameters");
      return NextResponse.json({
        status: 400,
        message: 'Missing required parameters',
        success: false
      });
    }

    // API configuration for PayUnit
    const BASE_URL = "https://gateway.payunit.net";
    
    // These are test credentials - replace with your actual production credentials
    const api_token = "live_KBBGqTTzFmRzK8seDJCJDbD01jSUcXrWG0pSjxei";
    const api_user = "dc3787e7-68d2-458f-8512-fbabafbda045";
    const api_password = "8322491a-c31a-4ce9-8ee9-68e5ebdf19c8";

    // Encode API credentials in Base64
    const credentials = Buffer.from(`${api_user}:${api_password}`).toString('base64');
    const authorization = `Basic ${credentials}`;

    const config: AxiosRequestConfig = {
      headers: {
        "x-api-key": api_token,
        "mode": "live",
        "Content-Type": "application/json",
        "Authorization": authorization,
      },
    };
    console.log("[POST] API Configuration prepared:", {
      baseUrl: BASE_URL,
      headers: {
        "x-api-key": api_token,
        "mode": "live",
        "Authorization": "Basic ****" // Masked for security
      }
    });

    // Create payment data
    const paymentData = {
      "total_amount": amount,
      "cancel_url": `https://intellex.study/payment-cancel?purchaseId=`,
      "success_url": `https://intellex.study/payment-success?purchaseId=`,
      "currency": "XAF",
      "mode": "payment",
      "transaction_id": transactionId,
      "return_url": "https://webhook.site/d457b2f3-dd71-4f04-9af5-e2fcf3be8f34",
      "notify_url": "https://webhook.site/d457b2f3-dd71-4f04-9af5-e2fcf3be8f34",
      "items": [
        {
          "price_description": {
            "unit_amount": amount
          },
          "product_description": {
            "name": description || "Team Kit Subscription",
            "image_url": "https://loopingbinary.s3.eu-north-1.amazonaws.com/looping-binary/InTelleX+(1).png",
            "about_product": "Monthly team subscription for full access to all modules"
          },
          "quantity": 1
        }
      ],
      "meta": {
        "phone_number_collection": false,
        "address_collection": false
      }
    };
    
    console.log("[POST] Payment data created:", JSON.stringify(paymentData));
    
    // Initialize payment
    console.log("[POST] Sending payment request to PayUnit");
    try {
      const response = await axios.post(
        `${BASE_URL}/api/gateway/checkout/initialize`,
        paymentData,
        config
      );

      console.log("[POST] Payment response:", response.data);
      return NextResponse.json(response.data, { status: 200 });
    } catch (axiosError: any) {
      console.error("[POST] PayUnit API error:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message
      });
      
      return NextResponse.json({
        status: axiosError.response?.status || 500,
        message: axiosError.response?.data?.message || "Payment gateway error",
        error: axiosError.response?.data,
        success: false
      }, {
        status: axiosError.response?.status || 500
      });
    }

  } catch (error: any) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({
      status: 500,
      message: error.message || "Something went wrong",
      success: false
    });
  }
}
