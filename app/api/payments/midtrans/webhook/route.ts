import { NextResponse } from "next/server"
import crypto from "node:crypto"

import { supabaseAdmin } from "@/lib/supabase/admin"
import { getMidtransTransactionStatus } from "@/lib/midtrans"

function verifySignature(payload: {
  order_id: string
  status_code: string
  gross_amount: string
  signature_key: string
}) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY
  if (!serverKey) return false

  const raw = `${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`
  const expected = crypto.createHash("sha512").update(raw).digest("hex")

  return expected === payload.signature_key
}

function mapStatus(
  transactionStatus: string,
  fraudStatus?: string
): "paid" | "unpaid" | "expired" {
  if (transactionStatus === "settlement") return "paid"
  if (transactionStatus === "capture" && fraudStatus === "accept") return "paid"
  if (transactionStatus === "expire") return "expired"
  if (transactionStatus === "cancel") return "expired"
  return "unpaid"
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_id,
    } = payload

    if (!order_id || !status_code || !gross_amount || !signature_key) {
      return NextResponse.json(
        { error: "Payload tidak valid" },
        { status: 400 }
      )
    }

    const isValid = verifySignature({
      order_id,
      status_code,
      gross_amount,
      signature_key,
    })

    if (!isValid) {
      return NextResponse.json(
        { error: "Signature tidak valid" },
        { status: 401 }
      )
    }

    const latest = await getMidtransTransactionStatus(order_id)

    const paymentStatus = mapStatus(
      latest.transaction_status,
      latest.fraud_status
    )

    const { data: payment, error: findError } = await supabaseAdmin
      .from("payments")
      .select("id, subscription_id, status")
      .eq("order_id", order_id)
      .single()

    if (findError || !payment) {
      return NextResponse.json(
        { error: "Payment tidak ditemukan" },
        { status: 404 }
      )
    }

    if (payment.status === "paid") {
      return NextResponse.json({
        success: true,
        message: "Sudah diproses sebelumnya",
      })
    }

    const { error: updatePaymentError } = await supabaseAdmin
      .from("payments")
      .update({
        status: paymentStatus,
        transaction_id: transaction_id ?? latest.transaction_id ?? null,
        paid_at:
          paymentStatus === "paid"
            ? new Date().toISOString()
            : null,
        raw_payload: latest,
      })
      .eq("id", payment.id)

    if (updatePaymentError) {
      return NextResponse.json(
        { error: updatePaymentError.message },
        { status: 500 }
      )
    }

    if (paymentStatus === "paid") {
      const { data: subscription } = await supabaseAdmin
        .from("subscriptions")
        .select(`
          id,
          ad_packages (
            duration_days
          )
        `)
        .eq("id", payment.subscription_id)
        .single()

      const pkg = Array.isArray(subscription?.ad_packages)
        ? subscription?.ad_packages[0]
        : subscription?.ad_packages

      const startDate = new Date()
      const endDate = new Date()

      endDate.setDate(endDate.getDate() + Number(pkg?.duration_days || 0))

      await supabaseAdmin
        .from("subscriptions")
        .update({
          status: "active",
          start_date: startDate.toISOString().slice(0, 10),
          end_date: endDate.toISOString().slice(0, 10),
          next_billing_date: endDate.toISOString().slice(0, 10),
        })
        .eq("id", payment.subscription_id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Terjadi kesalahan",
      },
      { status: 500 }
    )
  }
}