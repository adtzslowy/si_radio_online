"use client";

import Script from "next/script";

export function MidtransSnapScript() {
  return (
    <Script
      src="https://app.sandbox.midtrans.com/snap/snap.js"
      data-client-key={process.env.MIDTRANS_CLIENT_KEY}
      strategy="afterInteractive"
    />
  );
}
