'use client'

import { Card } from '@/components/ui/card'
import type { TickerData } from '@/lib/chart-data'

interface MarketInfoProps {
  ticker: TickerData
}

export function MarketInfo({ ticker }: MarketInfoProps) {
  const isPositive = parseFloat(ticker.change) >= 0

  return (
    <Card className="rounded-none border-x-0 border-t-0 bg-card px-6 py-3">
      <div className="flex items-center gap-8">
        <div>
          <div className="text-xs font-medium text-muted-foreground">Price</div>
          <div className="font-mono text-2xl font-bold">${ticker.price}</div>
        </div>
        <div>
          <div className="text-xs font-medium text-muted-foreground">24h Change</div>
          <div className={`font-mono text-base font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{ticker.change} ({isPositive ? '+' : ''}{ticker.changePercent}%)
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-muted-foreground">24h High</div>
          <div className="font-mono text-base">${ticker.high}</div>
        </div>
        <div>
          <div className="text-xs font-medium text-muted-foreground">24h Low</div>
          <div className="font-mono text-base">${ticker.low}</div>
        </div>
        <div>
          <div className="text-xs font-medium text-muted-foreground">24h Volume</div>
          <div className="font-mono text-base">{ticker.volume}</div>
        </div>
      </div>
    </Card>
  )
}
