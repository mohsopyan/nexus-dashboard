'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Database, Cpu, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
    {icon: LayoutDashboard, label: "Overview", href: "/dashboard"},
    {icon: Cpu, label: "AI Engine", href: "/dashboard/ai-engine"},
    {icon: Database, label: "Datasets", href: "/dashboard/datasets"},
    {icon: Settings, label: "Settings", href: "/dashboard/settings"},
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-screen w-64 flex-col border-r border-zinc-800 bg-zinc-950 px-4 py-8">
      <div className="mb-8 px-4">
        <h2 className="text-xl font-bold tracking-tighter text-zinc-100">NEXUS<span className="text-blue-500">.</span></h2>
      </div>
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
              pathname === item.href 
                ? "bg-zinc-900 text-zinc-100" 
                : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-100"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t border-zinc-800 pt-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-950/20 transition-colors">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
    )
}