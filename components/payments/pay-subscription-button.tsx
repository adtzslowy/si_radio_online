"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}

export function PaySubscriptionButton({
  subscriptionId,
}: {
  subscriptionId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePay = async () => {
    try {
      setLoading(true);

      const subscriptionid = "cb107a06-2d8d-438c-8300-ad7033710784";

      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscriptionId }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal membuat pembayaran");
      }

      if (!window.snap) {
        throw new Error("Snap.js belum termuat");
      }

      window.snap.pay(result.snapToken, {
        onSuccess: () => {
          router.refresh();
        },
        onPending: () => {
          router.refresh();
        },
        onError: () => {
          router.refresh();
        },
        onClose: () => {
          console.log("Popup pembayaran ditutup");
        },
      });

    } catch (error) {
        alert(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
        setLoading(false)
    }
  };

  return (
    <Button onClick={handlePay} disabled={loading}>
        {loading ? "Memproses..." : "Bayar sekarang"}
    </Button>
  )
}
