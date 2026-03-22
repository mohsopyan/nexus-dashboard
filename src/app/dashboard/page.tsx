'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
    const [user, setUser] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token")
      
      if (!token) {
        router.push("/login")
      } else {
        setUser("Hybrid Engineer")
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

//   Cegah "flicker" konten sebelum pengecekan auth selsai
if (isLoading) {
    return <div className="min-h-screen bg-zinc-950 text-zinc-500 p-8">Loading...</div>
}
    return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <h1 className="text-3xl font-bold tracking-tighter">Welcome to Nexus Dashboard</h1>
      <p className="text-zinc-400 mt-2">Status: Authenticated via Nexus-Bridge</p>
      
      <div className="mt-8 p-6 border border-zinc-800 rounded-lg bg-zinc-900/50">
        <p className="text-sm text-zinc-500">Koneksi ke port 3000: <span className="text-green-500">Active</span></p>
      </div>
    </div>
  )
}