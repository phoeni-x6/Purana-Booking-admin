import { requireRole } from "@/lib/auth/require-role";

export default async function AdminOnlyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireRole("admin");
  return children;
}
