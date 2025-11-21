'use client'

import { Button } from '@/components/ui/button'

interface TimeframeSelectorProps {
  value: string
  onChange: (timeframe: string) => void
}

const TIMEFRAMES = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1h', value: '1h' },
  { label: '4h', value: '4h' },
  { label: '1d', value: '1d' },
]

export function TimeframeSelector({ value, onChange }: TimeframeSelectorProps) {
  return (
    <div className="flex items-center gap-1 rounded-md border border-border bg-secondary p-1">
      {TIMEFRAMES.map((tf) => (
        <Button
          key={tf.value}
          variant={value === tf.value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onChange(tf.value)}
          className="h-7 px-3 font-mono text-xs"
        >
          {tf.label}
        </Button>
      ))}
    </div>
  )
}
