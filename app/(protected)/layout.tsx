import AdminLayout from "@/components/AdminLayout";
import { requireProfile } from "@/lib/auth/require-role";

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { profile } = await requireProfile();

  return (
    <AdminLayout
      role={profile.role}
      fullName={profile.full_name ?? "User"}
    >
      {children}
    </AdminLayout>
  );
}
