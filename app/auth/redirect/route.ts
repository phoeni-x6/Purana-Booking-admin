
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const supabase = await createClient();

    const { data: { user }, error: authError } =
        await supabase.auth.getUser();

    const url = new URL(request.url);

    if (authError || !user) {
        return NextResponse.redirect(
            new URL("/login", url.origin)
        );
    }

    const { data: profile, error } = await supabase
        .from("admin_profiles")
        .select("role, is_active")
        .eq("id", user.id)
        .maybeSingle();

    if (error || !profile || !profile.is_active) {
        return NextResponse.redirect(
            new URL("/login?error=not-authorized", url.origin)
        );
    }

    if (profile.role === "admin") {
        return NextResponse.redirect(
            new URL("/", url.origin)
        );
    }

    if (profile.role === "therapist") {
        return NextResponse.redirect(
            new URL("/calendar", url.origin)
        );
    }

    return NextResponse.redirect(
        new URL("/login?error=not-authorized", url.origin)
    );
}
