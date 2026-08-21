import { expect, test } from '@playwright/test'

test('каталог фильтрует список, открывает поезд и сохраняет фильтры', async ({
  page,
}) => {
  const expectedFilters = {
    search: 'БАЙКАЛЬСКАЯ СКАЗКА',
    region: 'Сибирь',
    month: '09',
  }

  const readFiltersFromUrl = () => {
    const url = new URL(page.url())

    return {
      search: url.searchParams.get('search'),
      region: url.searchParams.get('region'),
      month: url.searchParams.get('month'),
    }
  }

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const searchInput = page.locator('input[type="search"]')

  const regionFilter = page.getByTestId('region-filter')
  const monthFilter = page.getByTestId('month-filter')

  const regionInput = page.getByRole('combobox', {
    name: 'Регион',
    exact: true,
  })

  const monthInput = page.getByRole('combobox', {
    name: 'Месяц отправления',
    exact: true,
  })

  await searchInput.fill(expectedFilters.search)

  await expect
    .poll(() => new URL(page.url()).searchParams.get('search'))
    .toBe(expectedFilters.search)

  await regionFilter.click()

  await page
    .getByRole('option', {
      name: expectedFilters.region,
      exact: true,
    })
    .click()

  await expect
    .poll(() => new URL(page.url()).searchParams.get('region'))
    .toBe(expectedFilters.region)

  await monthFilter.click()

  await page
    .getByRole('option', {
      name: 'Сентябрь',
      exact: true,
    })
    .click()

  await expect
    .poll(() => new URL(page.url()).searchParams.get('month'))
    .toBe(expectedFilters.month)

  await expect(page.getByText('Найдено: 1', { exact: true })).toBeVisible()
  await expect.poll(readFiltersFromUrl).toEqual(expectedFilters)

  const trainCard = page.getByRole('article')

  await expect(trainCard).toHaveCount(1)
  await expect(trainCard).toContainText('Байкальская сказка')

  const detailsLink = trainCard.getByRole('link')

  await detailsLink.click()

  await expect(page).toHaveURL(/\/trains\/baikalskaya-skazka(?:\?|$)/, {
    timeout: 15_000,
  })

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Байкальская сказка',
    }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'К каталогу' }).click()

  await expect.poll(() => new URL(page.url()).pathname).toBe('/')
  await expect.poll(readFiltersFromUrl).toEqual(expectedFilters)

  await expect(searchInput).toHaveValue(expectedFilters.search)
  await expect(regionInput).toHaveValue(expectedFilters.region)
  await expect(monthInput).toHaveValue('Сентябрь')

  await expect(page.getByRole('article')).toHaveCount(1)
  await expect(page.getByRole('article')).toContainText('Байкальская сказка')
})
