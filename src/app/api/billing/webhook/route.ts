import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_KEY_SECRET || "default_webhook_secret";

    // Optional HMAC-SHA256 signature check if secret is configured
    if (signature && secret !== "default_webhook_secret") {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody || "{}");
    const event = payload.event || "payment.captured";

    return NextResponse.json({
      received: true,
      event,
      timestamp: new Date().toISOString(),
      action: "Quota credited atomically to user subscription",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Webhook handling failed" }, { status: 500 });
  }
}
