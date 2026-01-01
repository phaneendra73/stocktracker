"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Settings } from "@/lib/schemas/settings"
import { ArrowDownIcon, ArrowUpIcon, RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

type PriceHistory = {
  id: string
  symbol: string
  price: number
  changePercent: number
  createdAt: string
}

type AlertLog = {
  id: string
  symbol: string
  dropPercent: number
  priceAtAlert: number
  createdAt: string
}

export default function Dashboard() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [history, setHistory] = useState<PriceHistory[]>([])
  const [alerts, setAlerts] = useState<AlertLog[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    setRefreshing(true)
    try {
      const [settingsRes, historyRes, alertsRes] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/history"),
        fetch("/api/alerts")
      ])

      const s = await settingsRes.json() as Settings
      setSettings(s)

      const h = await historyRes.json() as PriceHistory[]
      setHistory(h)

      const a = await alertsRes.json() as AlertLog[]
      setAlerts(a)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  const latest = history[0]
  const isPositive = latest?.changePercent >= 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={refreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Main Status Card */}
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Status: {settings?.index || "Unknown Index"}
            </CardTitle>
            <Badge variant={isPositive ? "default" : "destructive"}>
              {latest ? (
                <>
                  {isPositive ? <ArrowUpIcon className="mr-1 h-3 w-3" /> : <ArrowDownIcon className="mr-1 h-3 w-3" />}
                  {Math.abs(latest.changePercent).toFixed(2)}%
                </>
              ) : "N/A"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {latest ? `$${latest.price.toFixed(2)}` : "No Data"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Symbol: {settings?.symbol} | Last Checked: {latest ? new Date(latest.createdAt).toLocaleTimeString() : "--"}
            </p>
          </CardContent>
        </Card>

        {/* Alert Summary Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Recorded since inception
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Price History</TabsTrigger>
          <TabsTrigger value="alerts">Alert Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Price Checks</CardTitle>
              <CardDescription>
                The last 50 data points collected by the market scraper.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {new Date(record.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>${record.price.toFixed(2)}</TableCell>
                      <TableCell className={record.changePercent >= 0 ? "text-green-600" : "text-red-600"}>
                        {record.changePercent > 0 ? "+" : ""}
                        {record.changePercent.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                  {history.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No history found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Alert Logs</CardTitle>
              <CardDescription>
                Instances where the price drop exceeded {settings?.dropPercentage || 5}%.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Price at Alert</TableHead>
                    <TableHead>Drop %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">
                        {new Date(alert.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>${alert.priceAtAlert.toFixed(2)}</TableCell>
                      <TableCell className="text-red-600 font-bold">
                        {alert.dropPercent.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                  {alerts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No alerts recorded yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
