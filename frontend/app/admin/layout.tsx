import React from "react";
import { SidebarAdmin } from "@/components/admin/layout/SidebarAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 items-start">
      <aside className="col-span-12 md:col-span-1 lg:col-span-1 ">
        <SidebarAdmin />
      </aside>
      <main className="col-span-12 md:col-span-10 lg:col-span-11 p-6">
        {children}
      </main>
    </div>
  );
}
