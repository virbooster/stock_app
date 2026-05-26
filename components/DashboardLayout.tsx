import { LayoutDashboard, Package, ArrowLeftRight, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6 font-bold text-xl text-gray-800">StockApp</div>
        <nav className="p-4 space-y-2">
          <a href="/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 text-gray-700 text-sm">
            <LayoutDashboard size={16} /> Dashboard
          </a>
          <a href="/dashboard/movements" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 text-gray-700 text-sm">
            <ArrowLeftRight size={16} /> Movements
          </a>
          <a href="/dashboard/archived" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 text-gray-700 text-sm">
            <Package size={16} /> Archivados
          </a>
          <form action={logout}>
            <button className="flex items-center gap-2 p-2 w-full rounded hover:bg-gray-100 text-gray-700 text-sm">
              <LogOut size={16} /> Logout
            </button>
          </form>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
