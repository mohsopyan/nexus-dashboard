"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Cpu, Database, Users } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import apiClient from "@/services/api-client"

interface StatCardProps {
  title: string
  value: string
  icon: React.ElementType
  description: string
}

const data = [
  { name: "00:00", requests: 400, latency: 120 },
  { name: "04:00", requests: 300, latency: 110 },
  { name: "08:00", requests: 900, latency: 180 },
  { name: "12:00", requests: 1200, latency: 210 },
  { name: "16:00", requests: 1500, latency: 250 },
  { name: "20:00", requests: 1100, latency: 190 },
]

export default function DashboardPage() {
  // 1. Sinkronisasi State dengan JSON Backend
  const [stats, setStats] = useState({ 
    total_queries: 0, 
    total_prompt_chars: 0,
    total_users: 0,
    dataset_size: 0
  })
  const [chartData, setChartData] = useState(data)
  const [user, setUser] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      
      if (!token) {
        router.push("/login")
      } else {
        setUser("Hybrid Engineer")
        
        try {
          const res = await apiClient.get("/api/v1/user/ai-stats")
          // Mapping data berdasarkan struktur: res.data.stats
          setStats(res.data.stats) 
        } catch (e) { 
          console.log("Nomor 1: Sinkronisasi gagal (CORS/Offline), data tetap 0.") 
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return <div className="min-h-screen bg-zinc-950 text-zinc-500 p-8">Loading...</div>
  }

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100 italic">Welcome, {user}</h1>
        <p className="text-zinc-500">Monitoring real-time AI Engine performance via Nexus-Bridge.</p>
      </div>

      {/* 1. Stat Cards Grid - Mapping Field Baru */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total AI Queries" 
          value={stats.total_queries.toString()} 
          icon={Cpu} 
          description="Total requests processed" 
        />
        <StatCard 
          title="Prompt Characters" 
          value={stats.total_prompt_chars.toLocaleString()} 
          icon={Activity} 
          description="Characters handled by AI" 
        />
        <StatCard 
          title="Total Users" 
          value={stats.total_users.toLocaleString()} 
          icon={Users} 
          description="+180 new users today" 
        />
        <StatCard 
          title="Dataset Size" 
          value={stats.dataset_size.toString()} 
          icon={Database} 
          description="PostgreSQL + Vector DB" 
        />
      </div>

      {/* 2. Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 text-sm font-medium">AI Traffic Trend (Requests)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px" }}
                  itemStyle={{ color: "#f4f4f5" }}
                />
                <Bar dataKey="requests" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 text-sm font-medium">System Latency (ms)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px" }}
                />
                <Line type="monotone" dataKey="latency" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">{title}</CardTitle>
        <Icon className="h-4 w-4 text-zinc-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-zinc-100">{value}</div>
        <p className="text-xs text-zinc-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}