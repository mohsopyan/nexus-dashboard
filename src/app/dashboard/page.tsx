"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Cpu, Database, Users, Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import apiClient from "@/services/api-client";
import { logService, AuditLog } from "@/services/log.service";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// --- Interfaces ---
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
}

interface DailyTrendItem {
  date: string;
  requests: number;
  avgLatency: number;
}

interface ChartDataPoint {
  name: string;
  requests: number;
  latency: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total_queries: 0,
    total_prompt_chars: 0,
    total_users: 0,
    dataset_size: 0,
  });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 1. Fetch Stats & Chart Data (Phase 2)
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      setUser("Hybrid Engineer");

      try {
        const res = await apiClient.get("/api/v1/user/ai-stats");
        setStats(res.data.stats);
        if (res.data.stats.dailyTrend) {
          const formatted = res.data.stats.dailyTrend.map((item: DailyTrendItem) => ({
            name: item.date,
            requests: item.requests,
            latency: item.avgLatency,
          }));
          setChartData(formatted);
        }
      } catch (e) {
        console.error("Sync gagal (Stats/Charts)");
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [router]);

  // 2. Fetch Audit Logs with Debounce (Phase 3)
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await logService.getAuditLogs({ search });

        if (response.data && Array.isArray(response.data.logs)) {
          setLogs(response.data.logs);
        } else if (Array.isArray(response.data)) {
          setLogs(response.data);
        } else {
          setLogs([]);
        }
      } catch (error) {
        console.error("Failed to fetch logs:", error);
        setLogs([]);
      }
    };

    const debounce = setTimeout(fetchLogs, 500);
    return () => clearTimeout(debounce);
  }, [search]);

  if (isLoading) {
    return <div className="min-h-screen bg-zinc-950 text-zinc-500 p-8">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 italic">Welcome, {user}</h1>
          <p className="text-zinc-500">Monitoring real-time AI Engine performance via Nexus-Bridge.</p>
        </div>
      </div>

      {/* 1. Stat Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total AI Queries" value={stats.total_queries.toString()} icon={Cpu} description="Total requests processed" />
        <StatCard title="Prompt Characters" value={stats.total_prompt_chars.toLocaleString()} icon={Activity} description="Characters handled by AI" />
        <StatCard title="Total Users" value={stats.total_users.toLocaleString()} icon={Users} description="Active user base" />
        <StatCard title="Dataset Size" value={stats.dataset_size.toString()} icon={Database} description="PostgreSQL + Vector DB" />
      </div>

      {/* 2. Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 text-sm font-medium">AI Traffic Trend (Requests)</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px" }} />
                <Bar dataKey="requests" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 text-sm font-medium">System Latency (ms)</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px" }} />
                <Line type="monotone" dataKey="latency" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 3. Audit Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-100">Operational Audit Trail</h2>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
            <Input placeholder="Search logs..." className="pl-8 bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-zinc-700" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400 w-[150px]">Timestamp</TableHead>
                <TableHead className="text-zinc-400 w-[150px]">Model</TableHead>
                <TableHead className="text-zinc-400">Prompt Preview</TableHead>
                <TableHead className="text-zinc-400 text-right">Latency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs?.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id} className="border-zinc-800 hover:bg-zinc-800/40 cursor-pointer transition-colors" onClick={() => setSelectedLog(log)}>
                    <TableCell className="text-xs text-zinc-500 font-mono">{new Date(log.createdAt).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-500/5 text-blue-400 border-blue-500/20 text-[10px] font-mono">
                        {log.modelUsed.replace("models/", "")}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-md truncate text-zinc-300 text-sm">{log.prompt}</TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      <span className={log.latency > 10000 ? "text-amber-500" : "text-emerald-500"}>{log.latency}ms</span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-zinc-500">
                    No logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="italic text-xl">Audit Detail Log</DialogTitle>
            <DialogDescription className="text-zinc-500 font-mono text-xs">
              ID: {selectedLog?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-blue-400">User Prompt:</h4>
              <div className="p-3 bg-zinc-950 rounded-md border border-zinc-800 text-sm italic">
                {`"${selectedLog?.prompt}"`}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-emerald-400">AI Response:</h4>
              <div className="p-3 bg-zinc-950 rounded-md border border-zinc-800 text-sm whitespace-pre-wrap leading-relaxed">
                {selectedLog?.aiResponse}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Model Engine</p>
                <p className="text-sm font-mono">{selectedLog?.modelUsed}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Execution Time</p>
                <p className={`text-sm font-mono ${selectedLog && selectedLog.latency > 10000 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {selectedLog?.latency}ms
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">{title}</CardTitle>
        <Icon className="h-4 w-4 text-zinc-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-zinc-100 font-mono">{value}</div>
        <p className="text-[10px] text-zinc-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
