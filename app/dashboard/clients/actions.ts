"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function createClientUser(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase()
  const password = String(formData.get("password") || "").trim()
  const fullName = String(formData.get("fullName") || "").trim()
  const companyName = String(formData.get("companyName") || "").trim()
  const phone = String(formData.get("phone") || "").trim() || null
  const address = String(formData.get("address") || "").trim() || null

  if (!email || !password || !fullName || !companyName) {
    throw new Error("Field wajib harus diisi.")
  }

  if (password.length < 6) {
    throw new Error("Password minimal 6 karakter.")
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role: "client",
      company_name: companyName,
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  if (!data.user) {
    throw new Error("User gagal dibuat.")
  }

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({
      full_name: fullName,
      email,
      role: "client",
      company_name: companyName,
      phone,
    })
    .eq("id", data.user.id)

  if (profileError) {
    throw new Error(profileError.message)
  }

  const { error: clientError } = await supabaseAdmin.from("clients").insert({
    profile_id: data.user.id,
    company_name: companyName,
    address,
    pic_name: fullName,
    pic_phone: phone,
    status: "active",
  })

  if (clientError) {
    throw new Error(clientError.message)
  }

  revalidatePath("/dashboard/clients")
  redirect("/dashboard/clients")
}