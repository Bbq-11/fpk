<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import type { Train } from '@data/trains'
import {
  formatDate,
  formatDuration,
  formatPrice,
  formatRoute,
  getNearDeparture,
} from '@utils/format.ts'

const props = defineProps<{
  train: Train
  selectedMonth?: string
}>()

const route = useRoute()

const nearestDeparture = computed(() => {
  const departures =
    props.selectedMonth ?
      props.train.departures.filter(
        (date) => date.slice(5, 7) === props.selectedMonth,
      )
    : props.train.departures

  return getNearDeparture(departures)
})

const detailsRoute = computed(() => ({
  name: 'train-details',
  params: {
    id: props.train.id,
  },
  query: route.query,
}))
</script>

<template>
  <article class="h-100 w-100">
    <VCard
      class="train-card d-flex flex-column h-100 rounded-xl bg-surface text-on-surface border border-border"
      :to="detailsRoute"
      variant="flat"
      hover>
      <VCardText class="d-flex flex-column flex-grow-1 pa-3 pa-sm-4 pa-md-6">
        <VChip
          class="align-self-start"
          color="secondary"
          variant="tonal"
          size="small">
          {{ train.region }}
        </VChip>
        <div>
          <h3
            class="text-title-large font-weight-bold ma-0 mt-3 mt-sm-4 text-wrap-anywhere">
            {{ train.name }}
          </h3>

          <p
            class="text-body-medium text-sm-body-large text-muted ma-0 mt-1 mt-sm-2 text-wrap">
            {{ formatRoute(train.route) }}
          </p>
        </div>

        <dl class="d-flex flex-column ga-2 ga-sm-3 ma-0 mt-auto pt-4 pt-sm-6">
          <div class="d-flex align-center justify-space-between ga-2 ga-sm-4">
            <dt class="text-body-small text-sm-body-medium text-muted">
              Длительность
            </dt>

            <dd
              class="text-body-medium text-sm-body-large ma-0 font-weight-medium text-right text-no-wrap">
              {{ formatDuration(train.duration_days) }}
            </dd>
          </div>

          <div class="d-flex align-center justify-space-between ga-2 ga-sm-4">
            <dt class="text-body-small text-sm-body-medium text-muted">
              Ближайшая дата
            </dt>

            <dd
              class="text-body-medium text-sm-body-large ma-0 font-weight-medium text-right text-no-wrap">
              {{
                nearestDeparture ? formatDate(nearestDeparture) : 'Уточняется'
              }}
            </dd>
          </div>
        </dl>
      </VCardText>

      <VDivider
        class="opacity-100"
        color="border" />

      <VCardActions
        class="flex-wrap justify-space-between align-end ga-3 px-3 px-sm-4 px-md-6 py-3 py-sm-4">
        <span class="text-body-medium text-sm-body-large">
          от

          <strong class="text-title-large font-weight-bold">
            {{ formatPrice(train.price_from) }}
          </strong>
        </span>

        <span
          class="d-inline-flex align-center ga-1 text-label-large text-secondary font-weight-bold">
          Подробнее

          <VIcon
            icon="mdi-arrow-right"
            size="18"
            aria-hidden="true" />
        </span>
      </VCardActions>
    </VCard>
  </article>
</template>

<style scoped lang="scss">
.train-card {
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;
}

@media (hover: hover) {
  .train-card:hover {
    box-shadow: 0 8px 12px rgba(24, 28, 34, 0.1) !important;
    transform: translateY(-3px);
  }
}
</style>
