"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import apiClient from "@/services/api-client"
import axios from "axios"
import Cookies from "js-cookie" // 1. Tambahkan Import ini

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Mengetuk pintu Nexus-Bridge
            const response = await apiClient.post("/api/v1/user/login", { email, password })
            const token = response.data.token

            // 2. Simpan Token JWT ke LocalStorage (Untuk Axios Interceptor)
            localStorage.setItem("token", token)

            // 3. Simpan Token ke Cookie (Agar Middleware tidak menghadang akses ke /dashboard)
            // expires: 1 artinya cookie valid selama 1 hari
            Cookies.set("token", token, { expires: 1, path: "/" })

            toast.success("Login Berhasil! Selamat datang di Nexus Dashboard.")
            
            // Berikan sedikit delay agar cookie terpasang sempurna sebelum pindah
            setTimeout(() => {
                router.push("/dashboard")
            }, 100)
            
        } catch (error: unknown) {
            const errorMessage = axios.isAxiosError(error) 
                ? error.response?.data?.message 
                : "Terjadi kesalahan sistem"

            toast.error(errorMessage || "Login Gagal. Cek koneksi ke Nexus-Bridge.")
        } finally {
            setLoading(false)
        }
    }

   return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900 text-zinc-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight italic">NEXUS<span className="text-blue-500">.</span> Dashboard</CardTitle>
          <CardDescription className="text-zinc-400">
            Masuk untuk mengelola ekosistem AI Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                className="bg-zinc-800 border-zinc-700 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                className="bg-zinc-800 border-zinc-700 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200" disabled={loading}>
              {loading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}