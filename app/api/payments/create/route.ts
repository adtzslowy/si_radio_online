import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createSnapTransaction, getMidtransTransactionStatus } from "@/lib/midtrans";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subscriptionId } = body as { subscriptionId?: string };

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "subscriptionId wajib diisi" },
        { status: 400 },
      );
    }

    const { data: subscription, error: subscriptionError } = await supabaseAdmin
      .from("subscriptions")
      .select(
        `
          id,
          client_id,
          package_id,
          status,
          clients (
            id,
            company_name,
            pic_name,
            pic_phone,
            profile_id
          ),
          ad_packages (
            id,
            name,
            price,
            duration_days
          )
        `,
      )
      .eq("id", subscriptionId)
      .single();

    if (subscriptionError || !subscription) {
      return NextResponse.json(
        { error: "Subscription tidak ditemukan!" },
        { status: 404 },
      );
    }

    const client = Array.isArray(subscription.clients)
      ? subscription.clients[0]
      : subscription.clients;

    const pkg = Array.isArray(subscription.ad_packages)
      ? subscription.ad_packages[0]
      : subscription.ad_packages;

    if (!client || !pkg) {
      return NextResponse.json(
        { error: "Data client atau paket tidak lengkap" },
        { status: 400 },
      );
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .eq("id", client.profile_id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Email client tidak ditemukan" },
        { status: 400 },
      );
    }

    const { data: existingPayment } = await supabaseAdmin
      .from("payments")
      .select("id, payment_url, raw_payload, order_id, status")
      .eq("subscription_id", subscription.id)
      .eq("status", "unpaid")
      .maybeSingle();

    if (existingPayment) {
      const midtransStatus = await getMidtransTransactionStatus(
        existingPayment.order_id,
      );

      if (midtransStatus.transaction_status === "expire") {
        await supabaseAdmin
          .from("payments")
          .update({
            status: "expired",
            raw_payload: midtransStatus,
          })
          .eq("id", existingPayment.id);
      } else {
        return NextResponse.json({
          success: true,
          redirectUrl: existingPayment.payment_url,
          snapToken: existingPayment.raw_payload?.snap_token ?? null,
          message: "Menggunakan invoice yang sudah ada",
        });
      }
    }

    const shortOrderId = subscription.id.slice(0, 8);
    const orderId = `INV-${shortOrderId}-${Date.now()}`;
    const amount = Number(pkg.price);

    const snap = await createSnapTransaction({
      order_id: orderId,
      gross_amount: amount,
      first_name: client.pic_name || client.company_name,
      email: profile.email,
      phone: client.pic_phone,
      item_details: [
        {
          id: pkg.id,
          name: pkg.name,
          price: amount,
          quantity: 1,
        },
      ],
    });

    const { error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        subscription_id: subscription.id,
        amount,
        due_date: new Date().toISOString().slice(0, 10),
        status: "unpaid",
        gateway: "midtrans",
        order_id: orderId,
        payment_url: snap.redirect_url,
        raw_payload: {
          snap_token: snap.token,
        },
      });

    if (paymentError) {
      return NextResponse.json(
        { error: paymentError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      orderId,
      redirectUrl: snap.redirect_url,
      snapToken: snap.token,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Terjadi kesalahan",
      },
      { status: 500 },
    );
  }
}
