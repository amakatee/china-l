"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type PaymentProofUploadProps = {
  shipmentId: string;
};

export function PaymentProofUpload({ shipmentId }: PaymentProofUploadProps) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const filePath = `${shipmentId}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("payment-proofs")
      .upload(filePath, file);

    if (error) {
      alert(error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("payment-proofs")
      .getPublicUrl(filePath);

    const formData = new FormData();
    formData.append("shipmentId", shipmentId);
    formData.append("paymentProofUrl", data.publicUrl);

    await fetch("/api/payment-proof", {
      method: "POST",
      body: formData,
    });

    setUploading(false);
    window.location.reload();
  }

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="image/*,.pdf"
        disabled={uploading}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />

      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}