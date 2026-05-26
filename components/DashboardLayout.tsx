import { LayoutDashboard, Package, ArrowLeftRight, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6 font-bold text-xl text-gray-800">StockApp</div>
        <nav className="p-4 space-y-2">
          <a href="/dashboard" className="flex items-center gap-3 p-3 rounded hover:bg-gray-100 text-gray-700">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="/dashboard/movements" className="flex items-center gap-3 p-3 rounded hover:bg-gray-100 text-gray-700">
            <ArrowLeftRight size={20} /> Movements
          </a>
          <form action={logout}>
            <button className="flex items-center gap-3 p-3 w-full rounded hover:bg-gray-100 text-gray-700">
              <LogOut size={20} /> Logout
            </button>
          </form>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
