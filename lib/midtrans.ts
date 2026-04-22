const MIDTRANS_BASE_URL=
    process.env.MIDTRANS_IS_PRODUCTION === "true" 
    ? "https://app.midtrans.com"
    : "https://app.sandbox.midtrans.com"

const MIDTRANS_API_URL = 
    process.env.MIDTRANS_IS_PRODUCTION === "true"
    ? "https://api.midtrans.com"
    : "https://api.sandbox.midtrans.com"

function getBasicAuthHeader(serverKey: string) {
    return `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`
}

export async function createSnapTransaction(payload: {
    order_id: string,
    gross_amount: number,
    first_name: string,
    email: string,
    phone?: string | null,
    item_details?: Array<{
        id: string,
        name: string,
        price: number,
        quantity: number,
    }>
}) {
    const serverKey = process.env.MIDTRANS_SERVER_KEY

    if (!serverKey) {
        throw new Error("MIDTRANS_SERVER_KEY belum diatur");
    }

    const response = await fetch(`${MIDTRANS_API_URL}/snap/v1/transactions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: getBasicAuthHeader(serverKey),
        },
        body: JSON.stringify({
            transaction_details: {
                order_id: payload.order_id,
                gross_amount: payload.gross_amount
            },
            customer_details: {
                first_name: payload.first_name,
                email: payload.email,
                phone: payload.phone ?? undefined
            },
            item_details: payload.item_details,
        }),
        cache: "no-store"
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error_messages?.join(", ") || "Gagal membuat transaksi Midtrans");
    }

    return data as {
        token: string
        redirect_url: string
    }
}

export async function getMidtransTransactionStatus(orderId: string) {
    const serverKey = process.env.MIDTRANS_SERVER_KEY

    if (!serverKey) {
        throw new Error("MIDTRANS_SERVER_KEY belum diatur");
    }

    const response = await fetch(`${MIDTRANS_API_URL}/v2/${orderId}/status`, {
        method: "GET",
        headers: {
            Authorization: getBasicAuthHeader(serverKey),
        },
        cache: "no-store",
    })

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.status_message || "Gagal mengabil status Midtrans");
    }

    return data
}

export {MIDTRANS_BASE_URL}