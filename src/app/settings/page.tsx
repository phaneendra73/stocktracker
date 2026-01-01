"use client"

import { useEffect, useState } from "react"
import { SettingsSchema, type Settings } from "@/lib/schemas/settings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    index: "",
    symbol: "",
    dropPercentage: 5,
  })

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(json => {
        const parsed = SettingsSchema.safeParse(json)
        if (parsed.success) {
          setSettings(parsed.data)
        }
      })
      .catch(err => {
        console.error("Invalid settings response", err)
        toast.error("Failed to load settings")
      })
      .finally(() => setFetching(false))
  }, [])


  async function saveSettings() {
    setLoading(true)

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        toast.success("Settings saved successfully")
      } else {
        toast.error("Failed to save settings")
      }
    } catch (e) {
      toast.error("Error saving settings")
    }

    setLoading(false)
  }

  if (fetching) return <div className="p-8 text-center text-muted-foreground">Loading settings...</div>

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Tracker Configuration</CardTitle>
          <CardDescription>Configure which index to track and when to trigger alerts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="index">Index Name</Label>
            <Input
              id="index"
              value={settings.index}
              onChange={e => setSettings({ ...settings, index: e.target.value })}
              placeholder="e.g. NIFTY 50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="symbol">Symbol (Yahoo Finance)</Label>
            <Input
              id="symbol"
              value={settings.symbol}
              onChange={e => setSettings({ ...settings, symbol: e.target.value })}
              placeholder="e.g. ^NSEI"
            />
            <p className="text-xs text-muted-foreground">The exact symbol used by Yahoo Finance.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="drop">Alert Threshold (%)</Label>
            <Input
              id="drop"
              type="number"
              value={settings.dropPercentage}
              onChange={e => setSettings({ ...settings, dropPercentage: Number(e.target.value) })}
            />
            <p className="text-xs text-muted-foreground">Trigger an alert if the index drops by this percentage.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveSettings} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
