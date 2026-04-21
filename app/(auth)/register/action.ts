"use server";

import { createClient } from "@/lib/supabase/server";

export async function signUpClient(formData: FormData) {
    const supabase = await createClient();

    // validation
    const fullName = String(formData.get("full_name") || "");
    const companyName = String(formData.get("company_name") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const {error} = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: "client",
                company_name: companyName
            }
        }
    });

    if (error) {
        throw new Error(error.message);
    }
}