// components/admin/AdminSidebar.tsx
"use client";

import { Home, LogOut, Utensils } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "ダッシュボード", path: "/admin", icon: <Home size={20} /> },
    { name: "レストラン管理", path: "/admin/restaurants", icon: <Utensils size={20} /> },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">せんべろ管理パネル</h2>
      </div>

      <nav className="mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center px-4 py-3 hover:bg-gray-800 ${pathname === item.path || pathname.startsWith(item.path + "/")
                    ? "bg-gray-800" : ""
                  }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-64 border-t border-gray-700">
        <Link
          href="/api/auth/signout"
          className="flex items-center px-4 py-3 hover:bg-gray-800"
        >
          <span className="mr-3"><LogOut size={20} /></span>
          ログアウト
        </Link>
      </div>
    </div>
  );
}