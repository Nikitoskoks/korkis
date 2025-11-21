const BYBIT_API = 'https://api.bybit.com/v5'
const CACHE_DURATION = 60 * 1000 // 60 seconds
const cache = new Map<string, { data: any; timestamp: number }>()

function getCacheKey(endpoint: string, params: Record<string, any> = {}): string {
  return `${endpoint}:${JSON.stringify(params)}`
}

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION
}

async function fetchWithCache(
  endpoint: string,
  params: Record<string, any> = {}
): Promise<any> {
  const cacheKey = getCacheKey(endpoint, params)
  const cached = cache.get(cacheKey)

  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data
  }

  try {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value)
        return acc
      }, {} as Record<string, string>)
    ).toString()

    const url = `${BYBIT_API}${endpoint}${queryString ? '?' + queryString : ''}`
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!response.ok) throw new Error(`API error: ${response.status}`)

    const data = await response.json()
    cache.set(cacheKey, { data, timestamp: Date.now() })
    return data
  } catch (error) {
    console.error('[v0] Bybit API error:', error)
    return null
  }
}

export async function getKlines(
  symbol: string,
  interval: string,
  limit: number = 200
) {
  const response = await fetchWithCache('/market/kline', {
    category: 'spot',
    symbol,
    interval,
    limit
  })

  if (!response?.result?.list) return []

  return response.result.list.reverse().map((candle: any) => ({
    time: Math.floor(Number(candle[0]) / 1000),
    open: Number(candle[1]),
    high: Number(candle[2]),
    low: Number(candle[3]),
    close: Number(candle[4]),
    volume: Number(candle[5])
  }))
}

export async function getInstruments(limit: number = 100) {
  const response = await fetchWithCache('/market/instruments-info', {
    category: 'spot',
    limit
  })

  if (!response?.result?.list) return []

  return response.result.list.map((inst: any) => ({
    symbol: inst.symbol,
    name: inst.symbol,
    baseCoin: inst.baseCoin,
    quoteCoin: inst.quoteCoin
  }))
}

export async function getTicker24(symbol: string) {
  const response = await fetchWithCache('/market/tickers', {
    category: 'spot',
    symbol
  })

  if (!response?.result?.list?.[0]) return null

  const ticker = response.result.list[0]
  return {
    price: Number(ticker.lastPrice),
    change: Number(ticker.price24hPcnt) * 100,
    high: Number(ticker.highPrice24h),
    low: Number(ticker.lowPrice24h),
    volume: Number(ticker.volume24h)
  }
}
