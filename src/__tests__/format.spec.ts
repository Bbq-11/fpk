import { describe, expect, it } from 'vitest'

import { getNearDeparture } from '@utils/format'

describe('getNearDeparture', () => {
  it('выбор ближайшей даты', () => {
    const departures = ['2026-10-04', '2026-09-06', '2026-09-20']
    const originalDepartures = [...departures]
    const today = new Date(2026, 8, 10)

    const result = getNearDeparture(departures, today)

    expect(result).toBe('2026-09-20')
    expect(departures).toEqual(originalDepartures)
  })
})
