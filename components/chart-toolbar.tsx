"use client"

import type React from "react"

import { useState } from "react"

interface ToolItem {
  id: string
  label: string
  icon: React.ReactNode
  submenu?: ToolItem[]
}

const CursorIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
  </svg>
)

const TrendLineIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 21h20M4 17l4-4 4 4 4-4" />
  </svg>
)

const LineIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="3" x2="21" y2="21" />
  </svg>
)

const ParallelChannelIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="2" y1="6" x2="22" y2="6" />
    <line x1="2" y1="18" x2="22" y2="18" />
  </svg>
)

const FibonacciIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="6" cy="6" r="2" />
    <circle cx="6" cy="12" r="2" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="12" cy="9" r="2" />
    <circle cx="12" cy="15" r="2" />
  </svg>
)

const GannIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3l18 18M3 21l18-18" />
  </svg>
)

const RectangleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="6" width="18" height="12" rx="2" />
  </svg>
)

const CircleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
  </svg>
)

const TriangleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 22 20 2 20" />
  </svg>
)

const PenIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L21 6" />
  </svg>
)

const BrushIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 18v-7a6 6 0 1 1 12 0v7M7 21h10M9 18l2-6 2 6" />
  </svg>
)

const HighlighterIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21h18M6 3l12 18M12 3l-6 18" />
  </svg>
)

const TextIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 7h16M6 3h12M4 21h16" />
  </svg>
)

const EmojiIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="9" cy="10" r="1.5" />
    <circle cx="15" cy="10" r="1.5" />
    <path d="M8 14s1 2 4 2 4-2 4-2" />
  </svg>
)

const MeasureIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
)

const MagnetIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 9v6M19 9v6M3 6h6v12H3zM15 6h6v12h-6z" />
  </svg>
)

const LockIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const UnlockIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 9.2-1" />
  </svg>
)

const EyeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const TrashIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)

const ChevronRightIcon = () => (
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
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const tools: ToolItem[] = [
  {
    id: "cursor",
    label: "Cursor",
    icon: <CursorIcon />,
  },
  {
    id: "trend-tools",
    label: "Trend Lines",
    icon: <TrendLineIcon />,
    submenu: [
      { id: "trend-line", label: "Trend Line", icon: <LineIcon /> },
      { id: "parallel-channel", label: "Parallel Channel", icon: <ParallelChannelIcon /> },
    ],
  },
  {
    id: "gann-fib",
    label: "Gann & Fibonacci",
    icon: <FibonacciIcon />,
    submenu: [
      { id: "fibonacci", label: "Fibonacci Retracement", icon: <FibonacciIcon /> },
      { id: "gann", label: "Gann Fan", icon: <GannIcon /> },
    ],
  },
  {
    id: "shapes",
    label: "Shapes",
    icon: <RectangleIcon />,
    submenu: [
      { id: "rectangle", label: "Rectangle", icon: <RectangleIcon /> },
      { id: "circle", label: "Circle", icon: <CircleIcon /> },
      { id: "triangle", label: "Triangle", icon: <TriangleIcon /> },
    ],
  },
  {
    id: "path-tools",
    label: "Path & Brush",
    icon: <PenIcon />,
    submenu: [
      { id: "pen", label: "Pen", icon: <PenIcon /> },
      { id: "brush", label: "Brush", icon: <BrushIcon /> },
      { id: "highlighter", label: "Highlighter", icon: <HighlighterIcon /> },
    ],
  },
  {
    id: "text-tools",
    label: "Text",
    icon: <TextIcon />,
    submenu: [
      { id: "text", label: "Text", icon: <TextIcon /> },
      { id: "emoji", label: "Emoji", icon: <EmojiIcon /> },
    ],
  },
  {
    id: "measure",
    label: "Measure",
    icon: <MeasureIcon />,
  },
  {
    id: "magnet",
    label: "Magnet",
    icon: <MagnetIcon />,
  },
  {
    id: "lock-unlock",
    label: "Lock / Unlock",
    icon: <LockIcon />,
    submenu: [
      { id: "lock", label: "Lock Drawings", icon: <LockIcon /> },
      { id: "unlock", label: "Unlock Drawings", icon: <UnlockIcon /> },
    ],
  },
  {
    id: "visibility",
    label: "Show / Hide",
    icon: <EyeIcon />,
  },
  {
    id: "delete",
    label: "Delete All",
    icon: <TrashIcon />,
  },
]

interface ChartToolbarProps {
  onToolSelect?: (toolId: string) => void
  activeTool?: string
}

export function ChartToolbar({ onToolSelect, activeTool: activeProp }: ChartToolbarProps) {
  const [activeTool, setActiveTool] = useState("cursor")
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  const currentActiveTool = activeProp || activeTool

  const handleToolClick = (toolId: string) => {
    setActiveTool(toolId)
    onToolSelect?.(toolId)
  }

  const handleSubtoolClick = (toolId: string) => {
    setActiveTool(toolId)
    setExpandedMenu(null)
    onToolSelect?.(toolId)
  }

  return (
    <div className="flex h-full w-16 flex-col items-center gap-1 rounded-[32px] bg-white py-4 shadow-sm overflow-hidden">
      {tools.map((tool) => (
        <div key={tool.id} className="relative">
          <button
            onClick={() => {
              handleToolClick(tool.id)
              if (tool.submenu) {
                setExpandedMenu(expandedMenu === tool.id ? null : tool.id)
              }
            }}
            className={`group flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
              currentActiveTool === tool.id || expandedMenu === tool.id
                ? "bg-[#4F46E5] text-white shadow-md"
                : "bg-[#E8EAF0] text-[#111827] hover:bg-[#D1D5DB]"
            }`}
            title={tool.label}
          >
            {tool.icon}
          </button>

          {tool.submenu && expandedMenu === tool.id && (
            <div className="absolute left-full top-0 ml-2 flex flex-col gap-1 rounded-xl bg-white p-1 shadow-lg">
              {tool.submenu.map((subtool) => (
                <button
                  key={subtool.id}
                  onClick={() => handleSubtoolClick(subtool.id)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-200 ${
                    currentActiveTool === subtool.id
                      ? "bg-[#4F46E5] text-white"
                      : "bg-[#F3F4F6] text-[#111827] hover:bg-[#E5E7EB]"
                  }`}
                >
                  <span className="text-sm font-medium">{subtool.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
