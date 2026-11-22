import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { planId, userId } = await req.json();

    const PLANS: Record<string, { name: string; amountInPaise: number; credits: number }> = {
      starter: { name: "DeedFlow Starter", amountInPaise: 149900, credits: 40 },
      growth: { name: "DeedFlow Builder Growth", amountInPaise: 399900, credits: 200 },
      project_pass: { name: "DeedFlow 12-Month Project Pass", amountInPaise: 1299900, credits: 300 },
    };

    const selectedPlan = PLANS[planId] || PLANS.growth;

    // Simulated Razorpay Order Creation
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return NextResponse.json({
      success: true,
      orderId,
      amount: selectedPlan.amountInPaise,
      currency: "INR",
      planName: selectedPlan.name,
      creditsAllocated: selectedPlan.credits,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Checkout creation failed" }, { status: 500 });
  }
}
