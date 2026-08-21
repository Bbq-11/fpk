import data from './trains.json'

export interface Train {
  id: string
  name: string
  region: string
  route: string[]
  duration_days: number
  departures: string[]
  price_from: number
  tags: string[]
  description: string
  excursions: string[]
  buy_url: string
}

export const trains = data.trains

export const getTrainById = (id: string): Train | undefined =>
  trains.find((train) => train.id === id)
