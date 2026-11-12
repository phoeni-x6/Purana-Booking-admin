
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Role = "admin" | "therapist";

export async function requireProfile() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile, error } = await supabase
        .from("admin_profiles")
        .select("id, role, is_active, full_name, therapist_id")
        .eq("id", user.id)
        .maybeSingle();

    if (error || !profile || !profile.is_active) {
        redirect("/login?error=not-authorized");
    }

    if (profile.role !== "admin" && profile.role !== "therapist") {
        redirect("/login?error=not-authorized");
    }

    return { user, profile: { ...profile, role: profile.role as Role } };
}

export async function requireRole(role: Role) {
    const result = await requireProfile();

    if (result.profile.role !== role) {
        redirect(role === "admin" ? "/calendar" : "/");
    }

    return result;
}
