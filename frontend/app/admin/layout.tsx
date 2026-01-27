import React from "react";
import { SidebarAdmin } from "@/components/admin/layout/SidebarAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh grid grid-cols-12">
      <aside className="col-span-12 md:col-span-3 lg:col-span-2 border-r bg-white">
        <SidebarAdmin />
      </aside>
      <main className="col-span-12 md:col-span-9 lg:col-span-10 p-6">
        {children}
      </main>
    </div>
  );
}
