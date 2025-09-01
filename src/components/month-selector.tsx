'use client'

import { ChevronDown } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

type Props = {
  year: number
  month: number
}

export function MonthSelector({ year, month }: Props) {
  const [open, setOpen] = useState(false)
  const [y, setY] = useState(String(year))
  const [m, setM] = useState(String(month))
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function apply() {
    const ym = `${y}-${String(Number(m)).padStart(2, '0')}`
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.set('ym', ym)
    // push new URL so server component re-renders with new searchParams
    router.push(`${pathname}?${params.toString()}`)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="inline-flex items-center gap-2 text-lg font-medium hover:underline focus:underline"
          aria-haspopup="dialog"
          title="年月を選択"
        >
          <span className="select-none">
            {year}年{month}月
          </span>
          <ChevronDown className="h-4 w-4 text-slate-600" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm">年</label>
            <input
              className="w-full rounded border px-2 py-1 text-sm"
              type="number"
              value={y}
              onChange={(e) => setY(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">月</label>
            <select
              className="w-full rounded border px-2 py-1 text-sm"
              value={m}
              onChange={(e) => setM(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((mm) => (
                <option key={mm} value={mm}>
                  {mm}月
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <Button onClick={apply}>適用</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default MonthSelector
