<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

import TrainCard from '@components/TrainCard.vue'
import TrainFilters from '@components/TrainFilters.vue'
import { trains } from '@data/trains'

const route = useRoute()
const router = useRouter()
const { smAndUp } = useDisplay()

const readQueryValue = (value: unknown): string =>
  typeof value === 'string' ? value : ''

const readMonthQuery = (value: unknown): string => {
  const queryValue = readQueryValue(value)
  const month = queryValue.includes('-') ? queryValue.slice(-2) : queryValue

  return /^(0[1-9]|1[0-2])$/.test(month) ? month : ''
}

const searchQuery = ref(readQueryValue(route.query.search))
const selectedRegion = ref(readQueryValue(route.query.region))
const selectedMonth = ref(readMonthQuery(route.query.month))

const regions = [...new Set(trains.map((train) => train.region))].sort(
  (first, second) => first.localeCompare(second, 'ru'),
)

const monthFormatter = new Intl.DateTimeFormat('ru-RU', {
  month: 'long',
  timeZone: 'UTC',
})

const months = [
  ...new Set(
    trains.flatMap((train) => train.departures.map((date) => date.slice(5, 7))),
  ),
]
  .sort((first, second) => Number(first) - Number(second))
  .map((value) => {
    const label = monthFormatter.format(new Date(`2020-${value}-01T00:00:00Z`))

    return {
      value,
      label: label.charAt(0).toLocaleUpperCase('ru-RU') + label.slice(1),
    }
  })

const filteredTrains = computed(() => {
  const normalizedSearch = searchQuery.value.trim().toLocaleLowerCase('ru-RU')

  return trains.filter((train) => {
    const matchesSearch =
      !normalizedSearch ||
      train.name.toLocaleLowerCase('ru-RU').includes(normalizedSearch)

    const matchesRegion =
      !selectedRegion.value || train.region === selectedRegion.value

    const matchesMonth =
      !selectedMonth.value ||
      train.departures.some((date) => date.slice(5, 7) === selectedMonth.value)

    return matchesSearch && matchesRegion && matchesMonth
  })
})

const hasActiveFilters = computed(() =>
  Boolean(
    searchQuery.value.trim() || selectedRegion.value || selectedMonth.value,
  ),
)

const resetFilters = () => {
  searchQuery.value = ''
  selectedRegion.value = ''
  selectedMonth.value = ''
}

watch(
  () => route.query,
  (query) => {
    searchQuery.value = readQueryValue(query.search)
    selectedRegion.value = readQueryValue(query.region)
    selectedMonth.value = readMonthQuery(query.month)
  },
)

watch(
  [searchQuery, selectedRegion, selectedMonth],
  ([search, region, month]) => {
    const normalizedSearch = search.trim()

    if (
      readQueryValue(route.query.search) === normalizedSearch &&
      readQueryValue(route.query.region) === region &&
      readQueryValue(route.query.month) === month
    ) {
      return
    }

    void router.replace({
      query: {
        ...(normalizedSearch && { search: normalizedSearch }),
        ...(region && { region }),
        ...(month && { month }),
      },
    })
  },
)
</script>

<template>
  <VContainer class="app-container pt-3 pt-sm-4 pt-md-6 pb-8 pb-sm-12">
    <VCard
      aria-labelledby="catalog-title"
      class="catalog-hero position-relative overflow-hidden rounded-xl"
      color="dark"
      variant="flat">
      <VCardText
        class="catalog-hero__content position-relative pa-4 pa-sm-8 pa-md-12">
        <VChip
          class="mb-3 mb-sm-4"
          color="secondary"
          variant="elevated"
          :size="smAndUp ? 'x-large' : 'default'">
          Путешествия по России
        </VChip>

        <h1
          id="catalog-title"
          class="text-display-small text-sm-display-medium text-md-display-large font-weight-bold ma-0 text-wrap-anywhere">
          Туристические поезда
        </h1>

        <p
          class="catalog-hero__description text-body-medium text-sm-title-medium text-on-dark mt-3 mt-sm-4 mb-0">
          Выберите железнодорожное путешествие
          <br v-if="smAndUp" />
          с готовым маршрутом и экскурсионной программой
        </p>
      </VCardText>
    </VCard>

    <TrainFilters
      v-model:search="searchQuery"
      v-model:region="selectedRegion"
      v-model:month="selectedMonth"
      :regions="regions"
      :months="months"
      :has-active-filters="hasActiveFilters"
      @reset="resetFilters" />

    <section
      class="mt-8 mt-sm-12"
      aria-labelledby="catalog-heading">
      <div
        class="d-flex align-center justify-space-between flex-wrap ga-3 ga-sm-4 mb-4 mb-sm-6">
        <h2
          id="catalog-heading"
          class="text-headline-medium text-sm-headline-large font-weight-bold ma-0">
          Доступные маршруты
        </h2>

        <VChip
          color="primary"
          variant="tonal"
          :size="smAndUp ? 'default' : 'small'"
          aria-live="polite">
          Найдено: {{ filteredTrains.length }}
        </VChip>
      </div>

      <VRow
        v-if="filteredTrains.length"
        class="ma-n2">
        <VCol
          v-for="train in filteredTrains"
          :key="train.id"
          class="d-flex pa-2"
          cols="12"
          md="6"
          lg="4">
          <TrainCard :train="train" />
        </VCol>
      </VRow>

      <VCard
        v-else
        class="text-center rounded-xl bg-surface text-on-surface border border-border pa-4 pa-sm-6 pa-md-8"
        variant="flat"
        role="status">
        <VIcon
          color="muted"
          icon="mdi-train-off"
          :size="smAndUp ? 40 : 36"
          aria-hidden="true" />

        <h3
          class="text-title-large text-sm-headline-small text-md-headline-medium font-weight-bold mt-3 mb-0">
          Поезда не найдены
        </h3>

        <p
          class="text-body-medium text-sm-body-large text-muted mt-2 mb-4 mb-sm-6">
          Попробуйте изменить параметры поиска.
        </p>

        <VBtn
          type="button"
          color="secondary"
          variant="flat"
          :size="smAndUp ? 'large' : 'default'"
          :block="!smAndUp"
          prepend-icon="mdi-filter-remove-outline"
          @click="resetFilters">
          Сбросить фильтры
        </VBtn>
      </VCard>
    </section>
  </VContainer>
</template>

<style scoped lang="scss">
.catalog-hero {
  isolation: isolate;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-dark)),
    rgb(var(--v-theme-on-background))
  ) !important;

  &::after {
    position: absolute;
    z-index: 0;
    top: -100px;
    right: -80px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgb(var(--v-theme-secondary));
    opacity: 0.72;
    content: '';
  }

  &__content {
    z-index: 1;
    max-width: 800px;
  }

  &__description {
    max-width: 660px;
    opacity: 0.78;
  }
}
</style>
