const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  dateStyle: 'long',
  timeZone: 'UTC',
})

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

const pluralRules = new Intl.PluralRules('ru-RU')

export const formatDate = (date: string): string =>
  dateFormatter.format(new Date(`${date}T00:00:00Z`)).replace(/\s*г\.$/u, '')

export const formatPrice = (price: number): string =>
  priceFormatter.format(price)

export const formatDuration = (days: number): string => {
  switch (pluralRules.select(days)) {
    case 'one':
      return `${days} день`
    case 'few':
      return `${days} дня`
    default:
      return `${days} дней`
  }
}

export const formatRoute = (route: string[]): string => {
  const firstCity = route[0]
  const lastCity = route.at(-1)

  if (!firstCity) return 'Маршрут уточняется'

  return lastCity && lastCity !== firstCity ?
      `${firstCity} → ${lastCity}`
    : firstCity
}

const toLocalIso = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const getNearDeparture = (
  departures: string[],
  today = new Date(),
): string | undefined => {
  const todayIso = toLocalIso(today)

  return [...departures].sort().find((departure) => departure >= todayIso)
}
