export interface Candle {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export function generateChartData(count: number = 500, basePrice: number = 43000): Candle[] {
  const candles: Candle[] = []
  let currentPrice = basePrice
  let trend = 0
  let volatility = 0.02
  
  const now = Date.now()
  const oneHour = 60 * 60 * 1000
  
  for (let i = 0; i < count; i++) {
    const time = now - (count - i) * oneHour
    
    if (Math.random() < 0.05) {
      trend = (Math.random() - 0.5) * 2
    }
    
    const change = (Math.random() - 0.5 + trend * 0.3) * currentPrice * volatility
    currentPrice = Math.max(currentPrice + change, basePrice * 0.7)
    
    const open = currentPrice
    const close = currentPrice + (Math.random() - 0.5) * currentPrice * volatility
    const high = Math.max(open, close) * (1 + Math.random() * 0.01)
    const low = Math.min(open, close) * (1 - Math.random() * 0.01)
    const volume = Math.floor(Math.random() * 50000 + 10000)
    
    candles.push({ time, open, high, low, close, volume })
    currentPrice = close
  }
  
  return candles
}

export interface TickerData {
  price: string
  change: string
  changePercent: string
  high: string
  low: string
  volume: string
}

export function calculateTickerData(candles: Candle[]): TickerData {
  if (candles.length === 0) {
    return {
      price: '0.00',
      change: '0.00',
      changePercent: '0.00',
      high: '0.00',
      low: '0.00',
      volume: '0'
    }
  }
  
  const latest = candles[candles.length - 1]
  const dayAgo = candles[Math.max(0, candles.length - 24)]
  
  const price = latest.close
  const change = price - dayAgo.close
  const changePercent = (change / dayAgo.close) * 100
  
  const last24h = candles.slice(-24)
  const high = Math.max(...last24h.map(c => c.high))
  const low = Math.min(...last24h.map(c => c.low))
  const volume = last24h.reduce((sum, c) => sum + c.volume, 0)
  
  return {
    price: price.toFixed(2),
    change: change.toFixed(2),
    changePercent: changePercent.toFixed(2),
    high: high.toFixed(2),
    low: low.toFixed(2),
    volume: volume.toFixed(0)
  }
}
