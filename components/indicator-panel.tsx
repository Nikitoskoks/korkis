'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

interface IndicatorPanelProps {
  indicators: Record<string, boolean>
  onChange: (indicators: Record<string, boolean>) => void
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

export function IndicatorPanel({ indicators, onChange, collapsed, onCollapsedChange }: IndicatorPanelProps) {
  const toggleIndicator = (key: string) => {
    onChange({ ...indicators, [key]: !indicators[key] })
  }

  const ChevronIcon = ({ direction }: { direction: 'left' | 'right' }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points={direction === 'right' ? '9 18 15 12 9 6' : '15 18 9 12 15 6'}></polyline>
    </svg>
  )

  if (collapsed) {
    return (
      <div className="flex h-full items-start justify-end p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCollapsedChange(false)}
          className="h-8 w-8"
        >
          <ChevronIcon direction="left" />
        </Button>
      </div>
    )
  }

  return (
    <Card className="h-full overflow-y-auto border-0 bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Indicators</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCollapsedChange(true)}
          className="h-8 w-8"
        >
          <ChevronIcon direction="right" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="ema50" className="text-sm">
            EMA 50
          </Label>
          <Switch
            id="ema50"
            checked={indicators.ema50}
            onCheckedChange={() => toggleIndicator('ema50')}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="ema200" className="text-sm">
            EMA 200
          </Label>
          <Switch
            id="ema200"
            checked={indicators.ema200}
            onCheckedChange={() => toggleIndicator('ema200')}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="volume" className="text-sm">
            Volume
          </Label>
          <Switch
            id="volume"
            checked={indicators.volume}
            onCheckedChange={() => toggleIndicator('volume')}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="rsi" className="text-sm">
            RSI
          </Label>
          <Switch
            id="rsi"
            checked={indicators.rsi}
            onCheckedChange={() => toggleIndicator('rsi')}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="macd" className="text-sm">
            MACD
          </Label>
          <Switch
            id="macd"
            checked={indicators.macd}
            onCheckedChange={() => toggleIndicator('macd')}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="vwap" className="text-sm">
            VWAP
          </Label>
          <Switch
            id="vwap"
            checked={indicators.vwap}
            onCheckedChange={() => toggleIndicator('vwap')}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="atr" className="text-sm">
            ATR
          </Label>
          <Switch
            id="atr"
            checked={indicators.atr}
            onCheckedChange={() => toggleIndicator('atr')}
          />
        </div>

        <div className="mt-6 rounded-md border border-border bg-muted p-3">
          <p className="text-xs text-muted-foreground">
            All indicators are now available: EMA 50, EMA 200, Volume, RSI, MACD, VWAP, and ATR.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
