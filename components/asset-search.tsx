'use client'

import { useState, useEffect } from 'react'
import { getInstruments } from '@/lib/bybit-api'

interface AssetSearchProps {
  onSelect: (symbol: string) => void
  onClose: () => void
}

export function AssetSearch({ onSelect, onClose }: AssetSearchProps) {
  const [search, setSearch] = useState('')
  const [instruments, setInstruments] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInstruments = async () => {
      setLoading(true)
      const data = await getInstruments(500)
      setInstruments(data)
      setFiltered(data.slice(0, 20))
      setLoading(false)
    }
    loadInstruments()
  }, [])

  useEffect(() => {
    if (!search) {
      setFiltered(instruments.slice(0, 20))
      return
    }
    const query = search.toUpperCase()
    const results = instruments.filter(
      inst => inst.symbol.includes(query) || inst.baseCoin.includes(query)
    ).slice(0, 20)
    setFiltered(results)
  }, [search, instruments])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#111827]">Search Assets</h2>
          <button
            onClick={onClose}
            className="text-[#6B7280] hover:text-[#111827]"
          >
            ✕
          </button>
        </div>

        <input
          autoFocus
          type="text"
          placeholder="Search by symbol or coin..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#9CA3AF] focus:border-[#4F46E5] focus:outline-none"
        />

        <div className="mt-3 max-h-80 overflow-y-auto rounded-lg bg-[#F9FAFB]">
          {loading ? (
            <div className="px-3 py-8 text-center text-sm text-[#6B7280]">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-[#6B7280]">No assets found</div>
          ) : (
            filtered.map(inst => (
              <button
                key={inst.symbol}
                onClick={() => {
                  onSelect(inst.symbol)
                  onClose()
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-[#E5E7EB] transition-colors"
              >
                <div className="font-medium text-[#111827]">{inst.symbol}</div>
                <div className="text-xs text-[#6B7280]">{inst.baseCoin}/{inst.quoteCoin}</div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
