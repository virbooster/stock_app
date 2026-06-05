"use client";

import { LayoutDashboard, Package, ArrowLeftRight, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { ThemeSelector } from "./ThemeSelector";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/movements", label: "Movements", icon: ArrowLeftRight },
    { href: "/dashboard/archived", label: "Archivados", icon: Package },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] transition-colors duration-200">
      <aside className="w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border)] flex flex-col transition-colors duration-200">
        <div className="p-6 font-bold text-xl tracking-tight text-[var(--text-main)]">
          Stock<span className="text-[var(--primary)]">App</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-2 p-2.5 rounded-md text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-[var(--primary)] text-white shadow-sm" 
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-app)] hover:text-[var(--text-main)]"
                }`}
              >
                <Icon size={18} /> {item.label}
              </Link>
            );
          })}
        </nav>

        <ThemeSelector />

        <div className="p-4 border-t border-[var(--border)]">
          <form action={logout}>
            <button className="flex items-center gap-2 p-2.5 w-full rounded-md hover:bg-red-50 text-red-600 text-sm font-medium transition-all">
              <LogOut size={18} /> Logout
            </button>
          </form>
        </div>
      </aside>
      
      <main className="flex-1 p-7 overflow-y-auto">{children}</main>
    </div>
  );
}
