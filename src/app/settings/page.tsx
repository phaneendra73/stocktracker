"use client"

import { useEffect, useState } from "react"
import { SettingsSchema, type Settings } from "@/lib/schemas/settings"

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    index: "",
    symbol: "",
    dropPercentage: 5,
  })

  const [loading, setLoading] = useState(false)


  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(json => {
        const parsed = SettingsSchema.parse(json) // ✅ runtime + type safety
        setSettings(parsed)
      })
      .catch(err => {
        console.error("Invalid settings response", err)
      })
  }, [])


  async function saveSettings() {
    setLoading(true)

    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    })

    setLoading(false)

    if (res.ok) alert("Settings saved ✅")
    else alert("Error ❌")
  }

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-xl font-semibold">⚙️ Settings</h1>

      <input
        className="w-full border p-2"
        value={settings.index}
        onChange={e =>
          setSettings({ ...settings, index: e.target.value })
        }
        placeholder="Index name"
      />

      <input
        className="w-full border p-2"
        value={settings.symbol}
        onChange={e =>
          setSettings({ ...settings, symbol: e.target.value })
        }
        placeholder="Symbol"
      />

      <input
        type="number"
        className="w-full border p-2"
        value={settings.dropPercentage}
        onChange={e =>
          setSettings({
            ...settings,
            dropPercentage: Number(e.target.value),
          })
        }
      />

      <button
        onClick={saveSettings}
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  )
}
