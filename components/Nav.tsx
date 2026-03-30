"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Settings,
  SlidersHorizontal ,
  Icon,
  LogOut
} from "lucide-react";
export default function Nav() {
  const pathname = usePathname();

  // 🔥 NEW STATE
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // 🔥 lưu trạng thái collapse
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setCollapsed(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  const inactiveLink =
    "flex items-center gap-2 p-2 transition-all";
  const activeLink =
    inactiveLink + " bg-white text-blue-900 rounded-l-lg";

  return (
    <>
      {/* 🔥 Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 🔥 Sidebar */}
      <aside
        className={`
          fixed md:static z-50 top-0 left-0 h-full bg-blue-900 text-white
          transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          p-4 pr-0
        `}
      >
        {/* 🔥 Header */}
        <div className="flex items-center justify-between mb-6 mr-4">
          {!collapsed && (
            <span className="flex gap-1 items-center">
              EcommerceAdmin
            </span>
          )}

          {/* collapse button (desktop) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block"
          >
            ⇆
          </button>

          {/* close mobile */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* 🔥 Menu */}
        <nav className="flex flex-col gap-2">
          <NavLink
            href="/"
            active={pathname === "/"}
            collapsed={collapsed}
            icon={LayoutDashboard}
          >
            Dashboard
          </NavLink>

          <NavLink
            href="/products"
            active={pathname.startsWith("/products")}
            collapsed={collapsed}
            icon={Package}
          >
            Products
          </NavLink>

          <NavLink
            href="/categories"
            active={pathname.startsWith("/categories")}
            collapsed={collapsed}
            icon={FolderTree}
          >
            Categories
          </NavLink>
          <NavLink
            href="/properties"
            active={pathname.startsWith("/properties")}
            collapsed={collapsed}
            icon={SlidersHorizontal }
          >
            Properties
          </NavLink>
          <NavLink
            href="/orders"
            active={pathname === "/orders"}
            collapsed={collapsed}
            icon={ShoppingCart}
          >
            Orders
          </NavLink>

          <NavLink
            href="/settings"
            active={pathname === "/settings"}
            collapsed={collapsed}
            icon={Settings}
          >
            Settings
          </NavLink>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="
              group relative flex items-center gap-2 p-2
              rounded-lg text-red-400
              transition-all duration-200
              hover:bg-red-500/10 hover:text-red-500
              cursor-pointer
            "
            >
            <LogOut size={20} />
            {!collapsed && "Logout"}
            {/* 🔥 tooltip khi collapse */}
            {collapsed && (
              <span
                className="
                  absolute left-14 top-1/2 -translate-y-1/2
                  bg-black text-white text-sm px-2 py-1 rounded
                  opacity-0 group-hover:opacity-100
                  transition whitespace-nowrap z-50 
                "
              >
                Logout
              </span>
            )}

          </button>
        </nav>
      </aside>

      {/* 🔥 Mobile button (đặt ở layout/header) */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-900 text-white p-2 rounded"
        onClick={() => setIsOpen(true)}
      >
        ☰
      </button>
    </>
  );
}

/* 🔥 Tách component link cho gọn */
function NavLink({ href, active, children, collapsed, icon: Icon }) {
  const inactiveLink =
    "group flex items-center gap-2 p-2 transition-all relative";
  const activeLink =
    inactiveLink + " bg-white text-blue-900 rounded-l-lg";

  return (
    <Link href={href} className={active ? activeLink : inactiveLink}>
      {/* 🔥 icon placeholder (bạn giữ svg cũ cũng được) */}
      {Icon && <Icon size={20} />}

      {/* label */}
      {!collapsed && <span>{children}</span>}

      {/* 🔥 tooltip khi collapse */}
      {collapsed && (
        <span className="absolute left-16 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          {children}
        </span>
      )}
    </Link>
  );
}