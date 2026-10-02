import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { adminSettings } from "@/lib/admin-data";
import { requireStaffPage } from "@/lib/auth";

export const metadata: Metadata = { title: "Business Info" };

export default async function SettingsPage() {
  await requireStaffPage("admin");
  const settings = await adminSettings();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl font-semibold text-maroon-deep">Business Information</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
