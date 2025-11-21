'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface IndicatorSettingsProps {
  open: boolean
  onClose: () => void
  colors: Record<string, string>
  onColorsChange: (colors: Record<string, string>) => void
  selectedArea: string | null
}

export function IndicatorSettings({ open, onClose, colors, onColorsChange, selectedArea }: IndicatorSettingsProps) {
  const handleColorChange = (key: string, value: string) => {
    onColorsChange({ ...colors, [key]: value })
  }

  const mainChartIndicators = [
    { key: 'ema50', label: 'EMA 50' },
    { key: 'ema200', label: 'EMA 200' },
    { key: 'vwap', label: 'VWAP' },
    { key: 'atr', label: 'ATR' },
  ]

  const oscillatorIndicators = [
    { key: 'rsi', label: 'RSI' },
    { key: 'macd', label: 'MACD Line' },
    { key: 'macdSignal', label: 'MACD Signal' },
  ]

  const indicatorsToShow = selectedArea === 'main' ? mainChartIndicators : oscillatorIndicators

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Indicator Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {indicatorsToShow.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <Label htmlFor={key} className="text-sm">
                {label}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={key}
                  type="color"
                  value={colors[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="h-10 w-20 cursor-pointer"
                />
                <span className="text-xs text-muted-foreground">{colors[key]}</span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
