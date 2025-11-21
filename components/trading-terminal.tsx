"use client"

import { useState, useEffect, useMemo } from "react"
import { CustomTVChart } from "./CustomTVChart"
import { generateChartData, calculateTickerData } from "@/lib/chart-data"
import { ChartToolbar } from "./chart-toolbar"
import { AssetSearch } from "./asset-search"
import { getKlines } from "@/lib/bybit-api"
import type { Candle } from "@/lib/chart-data"

// ... existing icons ...

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const BarChartIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
)

const ClockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const BellIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

export default function TradingTerminal() {
  const [symbol, setSymbol] = useState("BTCUSDT")
  const [timeframe, setTimeframe] = useState("4h")
  const [showTimeframeDropdown, setShowTimeframeDropdown] = useState(false)
  const [showIndicatorsDropdown, setShowIndicatorsDropdown] = useState(false)
  const [showAssetSearch, setShowAssetSearch] = useState(false)
  const [selectedTool, setSelectedTool] = useState("cursor")
  const [chartData, setChartData] = useState<Candle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [indicators, setIndicators] = useState({
    ema50: true,
    ema200: true,
    rsi: false,
    macd: false,
    volume: true,
    vwap: false,
    atr: false,
  })

  useEffect(() => {
    const loadChartData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Map timeframe to Bybit interval format
        const intervalMap: Record<string, string> = {
          "1m": "1",
          "5m": "5",
          "15m": "15",
          "30m": "30",
          "1h": "60",
          "4h": "240",
          "1d": "D",
          "1w": "W",
          "1M": "M",
        }

        const interval = intervalMap[timeframe] || "240"
        console.log(`[v0] Loading ${symbol} ${timeframe} data...`)

        const klines = await getKlines(symbol, interval, 200)

        if (klines && klines.length > 0) {
          setChartData(klines)
          console.log(`[v0] Loaded ${klines.length} candles`)
        } else {
          // Fallback to dummy data if API returns empty
          setChartData(generateChartData(500, 43000))
          console.log("[v0] Using fallback data")
        }
      } catch (err) {
        console.error("[v0] Error loading chart data:", err)
        setError(err instanceof Error ? err.message : "Failed to load data")
        // Fallback data on error
        setChartData(generateChartData(500, 43000))
      } finally {
        setIsLoading(false)
      }
    }

    loadChartData()
  }, [symbol, timeframe])

  const tickerData = useMemo(() => calculateTickerData(chartData), [chartData])

  const timeframes = ["1m", "5m", "15m", "30m", "1h", "4h", "1d", "1w", "1M"]

  const formatPrice = (price: number) =>
    price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : ""
    return `${sign}${change.toFixed(2)}%`
  }

  const toggleIndicator = (key: string) => {
    setIndicators((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const activeIndicatorsCount = Object.values(indicators).filter(Boolean).length

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId)
    handleToolAction(toolId)
  }

  const handleToolAction = (toolId: string) => {
    switch (toolId) {
      case "cursor":
        console.log("[v0] Activated cursor tool - ready to select/move objects")
        break
      case "trend-line":
        console.log("[v0] Activated trend line tool - click two points to draw")
        break
      case "parallel-channel":
        console.log("[v0] Activated parallel channel tool - click three points")
        break
      case "fibonacci":
        console.log("[v0] Activated fibonacci retracement - click two points")
        break
      case "gann":
        console.log("[v0] Activated gann fan - click to place")
        break
      case "rectangle":
        console.log("[v0] Activated rectangle tool - drag to draw")
        break
      case "circle":
        console.log("[v0] Activated circle tool - drag to draw")
        break
      case "triangle":
        console.log("[v0] Activated triangle tool - click three points")
        break
      case "pen":
        console.log("[v0] Activated pen tool - draw freehand")
        break
      case "brush":
        console.log("[v0] Activated brush tool - draw with brush")
        break
      case "highlighter":
        console.log("[v0] Activated highlighter tool - highlight areas")
        break
      case "text":
        console.log("[v0] Activated text tool - click to add text")
        break
      case "emoji":
        console.log("[v0] Activated emoji tool - select emoji to place")
        break
      case "measure":
        console.log("[v0] Activated measure tool - measure distances")
        break
      case "magnet":
        console.log("[v0] Magnet mode toggled - snap to candlesticks")
        break
      case "lock":
        console.log("[v0] All drawings locked - cannot modify")
        break
      case "unlock":
        console.log("[v0] All drawings unlocked - ready to edit")
        break
      case "visibility":
        console.log("[v0] Hide/Show toggle - press to toggle visibility")
        break
      case "delete":
        console.log("[v0] Delete all drawings - clearing canvas")
        break
      default:
        console.log("[v0] Tool action:", toolId)
    }
  }

  return (
    <div className="flex h-screen w-full flex-col gap-6 bg-[#F7F8FA] p-8">
      <div className="flex items-center gap-2 rounded-[32px] bg-white px-4 py-2 shadow-sm">
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8EAF0] transition-colors hover:bg-[#d5d8e3]">
          <SearchIcon />
        </button>

        {showAssetSearch ? (
          <AssetSearch
            onClose={() => setShowAssetSearch(false)}
            onSelect={(newSymbol) => {
              setSymbol(newSymbol)
              setShowAssetSearch(false)
            }}
          />
        ) : (
          <button
            className="flex h-8 items-center gap-2 rounded-full bg-[#E8EAF0] px-3 transition-colors hover:bg-[#d5d8e3]"
            onClick={() => setShowAssetSearch(true)}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4F46E5]">
              <span className="text-[10px] font-bold text-white">₿</span>
            </div>
            <span className="text-xs font-medium text-[#111827]">{symbol}</span>
            <ChevronDownIcon />
          </button>
        )}

        <div className="relative z-50">
          <button
            onClick={() => setShowTimeframeDropdown(!showTimeframeDropdown)}
            className="flex h-8 items-center gap-2 rounded-full bg-[#E8EAF0] px-3 transition-colors hover:bg-[#d5d8e3]"
          >
            <span className="text-xs font-medium text-[#111827]">{timeframe}</span>
            <ChevronDownIcon />
          </button>

          <div
            className={`absolute left-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 ease-out origin-top ${
              showTimeframeDropdown ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
            }`}
          >
            <div className="p-2">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setTimeframe(tf)
                    setShowTimeframeDropdown(false)
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                    timeframe === tf ? "bg-[#4F46E5] text-white" : "text-[#111827] hover:bg-[#F3F4F6]"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button className="flex h-8 items-center gap-2 rounded-full bg-[#E8EAF0] px-3 transition-colors hover:bg-[#d5d8e3]">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div className="h-1 w-0.5 bg-[#111827]" />
              <div className="h-2 w-2 bg-[#10B981]" />
              <div className="h-1 w-0.5 bg-[#111827]" />
            </div>
            <div className="flex flex-col items-center">
              <div className="h-2 w-0.5 bg-[#111827]" />
              <div className="h-1.5 w-2 bg-[#EF4444]" />
              <div className="h-1 w-0.5 bg-[#111827]" />
            </div>
          </div>
          <ChevronDownIcon />
        </button>

        <div className="relative z-50">
          <button
            onClick={() => setShowIndicatorsDropdown(!showIndicatorsDropdown)}
            className="flex h-8 items-center gap-2 rounded-full bg-[#E8EAF0] px-3 transition-colors hover:bg-[#d5d8e3]"
          >
            <BarChartIcon />
            <span className="text-xs font-medium text-[#111827]">Indicators</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#d5d8e3] text-[10px] text-[#6B7280]">
              {activeIndicatorsCount}
            </span>
            <ChevronDownIcon />
          </button>

          <div
            className={`absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 ease-out ${
              showIndicatorsDropdown ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
            style={{ transformOrigin: "top" }}
          >
            <div className="p-2">
              <div className="mb-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                Moving Averages
              </div>

              <button
                onClick={() => toggleIndicator("ema50")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-[#F3F4F6]"
              >
                <span className="text-sm text-[#111827]">EMA 50</span>
                <div
                  className={`h-5 w-9 rounded-full transition-colors ${indicators.ema50 ? "bg-[#4F46E5]" : "bg-[#D1D5DB]"}`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${indicators.ema50 ? "translate-x-4" : "translate-x-0"}`}
                  />
                </div>
              </button>

              <button
                onClick={() => toggleIndicator("ema200")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-[#F3F4F6]"
              >
                <span className="text-sm text-[#111827]">EMA 200</span>
                <div
                  className={`h-5 w-9 rounded-full transition-colors ${indicators.ema200 ? "bg-[#4F46E5]" : "bg-[#D1D5DB]"}`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${indicators.ema200 ? "translate-x-4" : "translate-x-0"}`}
                  />
                </div>
              </button>

              <button
                onClick={() => toggleIndicator("vwap")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-[#F3F4F6]"
              >
                <span className="text-sm text-[#111827]">VWAP</span>
                <div
                  className={`h-5 w-9 rounded-full transition-colors ${indicators.vwap ? "bg-[#4F46E5]" : "bg-[#D1D5DB]"}`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${indicators.vwap ? "translate-x-4" : "translate-x-0"}`}
                  />
                </div>
              </button>

              <div className="my-2 border-t border-[#E5E7EB]" />

              <div className="mb-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                Oscillators
              </div>

              <button
                onClick={() => toggleIndicator("rsi")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-[#F3F4F6]"
              >
                <span className="text-sm text-[#111827]">RSI (14)</span>
                <div
                  className={`h-5 w-9 rounded-full transition-colors ${indicators.rsi ? "bg-[#4F46E5]" : "bg-[#D1D5DB]"}`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${indicators.rsi ? "translate-x-4" : "translate-x-0"}`}
                  />
                </div>
              </button>

              <button
                onClick={() => toggleIndicator("macd")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-[#F3F4F6]"
              >
                <span className="text-sm text-[#111827]">MACD (12, 26, 9)</span>
                <div
                  className={`h-5 w-9 rounded-full transition-colors ${indicators.macd ? "bg-[#4F46E5]" : "bg-[#D1D5DB]"}`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${indicators.macd ? "translate-x-4" : "translate-x-0"}`}
                  />
                </div>
              </button>

              <button
                onClick={() => toggleIndicator("atr")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-[#F3F4F6]"
              >
                <span className="text-sm text-[#111827]">ATR (14)</span>
                <div
                  className={`h-5 w-9 rounded-full transition-colors ${indicators.atr ? "bg-[#4F46E5]" : "bg-[#D1D5DB]"}`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${indicators.atr ? "translate-x-4" : "translate-x-0"}`}
                  />
                </div>
              </button>

              <div className="my-2 border-t border-[#E5E7EB]" />

              <div className="mb-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Volume</div>

              <button
                onClick={() => toggleIndicator("volume")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-[#F3F4F6]"
              >
                <span className="text-sm text-[#111827]">Volume</span>
                <div
                  className={`h-5 w-9 rounded-full transition-colors ${indicators.volume ? "bg-[#4F46E5]" : "bg-[#D1D5DB]"}`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${indicators.volume ? "translate-x-4" : "translate-x-0"}`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        <button className="flex h-8 items-center gap-2 rounded-full bg-[#E8EAF0] px-3 transition-colors hover:bg-[#d5d8e3]">
          <ClockIcon />
          <span className="text-xs font-medium text-[#111827]">Replay</span>
        </button>

        <button className="flex h-8 items-center gap-2 rounded-full bg-[#E8EAF0] px-3 transition-colors hover:bg-[#d5d8e3]">
          <BellIcon />
          <span className="text-xs font-medium text-[#111827]">Alerts</span>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#d5d8e3] text-[10px] text-[#6B7280]">
            8
          </span>
          <ChevronDownIcon />
        </button>

        <div className="flex-1" />
      </div>

      <div className="flex flex-1 gap-3 overflow-hidden">
        <ChartToolbar onToolSelect={handleToolSelect} activeTool={selectedTool} />

        <div className="flex-1 rounded-[32px] bg-white shadow-sm overflow-hidden flex flex-col">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-[#4F46E5] border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-sm text-[#6B7280]">
                  Loading {symbol} {timeframe}...
                </p>
              </div>
            </div>
          )}

          {!isLoading && <CustomTVChart candles={chartData} indicators={indicators} activeTool={selectedTool} />}
        </div>
      </div>
    </div>
  )
}
