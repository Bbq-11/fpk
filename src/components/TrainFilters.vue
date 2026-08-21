<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

interface MonthOption {
  value: string
  label: string
}

interface SelectOption {
  value: string
  title: string
}

const props = defineProps<{
  regions: readonly string[]
  months: readonly MonthOption[]
  hasActiveFilters: boolean
}>()

const search = defineModel<string>('search', { required: true })
const region = defineModel<string>('region', { required: true })
const month = defineModel<string>('month', { required: true })

const emit = defineEmits<{
  reset: []
}>()

const SEARCH_DEBOUNCE = 300

const searchInput = ref<string | null>(search.value)
const isSearching = ref(false)

let searchTimer: ReturnType<typeof setTimeout> | undefined

watch(searchInput, (value) => {
  clearTimeout(searchTimer)

  const normalizedValue = value?.trim() ?? ''

  if (!normalizedValue) {
    isSearching.value = false
    search.value = ''
    return
  }

  isSearching.value = true

  searchTimer = setTimeout(() => {
    search.value = normalizedValue
    isSearching.value = false
  }, SEARCH_DEBOUNCE)
})

watch(search, (value) => {
  if (value !== (searchInput.value ?? '')) {
    searchInput.value = value
  }
})

onBeforeUnmount(() => {
  clearTimeout(searchTimer)
})

const menuProps = {
  maxHeight: 320,
  offset: 8,
  maxWidth: 0,
  contentClass: 'text-body-medium text-sm-body-large',
} as const

const regionItems = computed<SelectOption[]>(() => [
  { value: '', title: 'Все регионы' },
  ...props.regions.map((region) => ({
    value: region,
    title: region,
  })),
])

const monthItems = computed<SelectOption[]>(() => [
  { value: '', title: 'Все месяцы' },
  ...props.months.map(({ value, label }) => ({
    value,
    title: label,
  })),
])
</script>

<template>
  <VForm
    class="mt-4 mt-sm-6"
    aria-label="Поиск и фильтры туристических поездов"
    @submit.prevent>
    <VCard
      class="position-relative rounded-xl bg-surface text-on-surface border border-border"
      variant="flat">
      <VBtn
        v-if="hasActiveFilters"
        class="filters__reset"
        type="button"
        icon="mdi-filter-remove-outline"
        variant="plain"
        color="secondary"
        size="small"
        :ripple="false"
        aria-label="Сбросить фильтры"
        @click="emit('reset')" />

      <VCardText class="filters__content pa-3 pa-sm-4 pa-md-6">
        <VRow
          class="ma-n2 align-center"
          no-gutters>
          <VCol
            class="pa-2"
            cols="12"
            md="6">
            <VTextField
              v-model="searchInput"
              class="text-body-medium text-sm-body-large"
              type="search"
              label="Название поезда"
              placeholder="Например, Байкальская сказка"
              autocomplete="off"
              prepend-inner-icon="mdi-magnify"
              :loading="isSearching"
              clearable
              hide-details />
          </VCol>

          <VCol
            class="pa-2"
            cols="12"
            sm="6"
            md="3">
            <VSelect
              v-model="region"
              data-testid="region-filter"
              class="text-body-medium text-sm-body-large"
              :items="regionItems"
              :menu-props="menuProps"
              item-title="title"
              item-value="value"
              label="Регион"
              menu-icon="mdi-chevron-down"
              hide-details />
          </VCol>

          <VCol
            class="pa-2"
            cols="12"
            sm="6"
            md="3">
            <VSelect
              v-model="month"
              data-testid="month-filter"
              class="text-body-medium text-sm-body-large"
              :items="monthItems"
              :menu-props="menuProps"
              item-title="title"
              item-value="value"
              label="Месяц отправления"
              menu-icon="mdi-chevron-down"
              hide-details />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VForm>
</template>

<style scoped lang="scss">
.filters__content {
  padding-right: 56px !important;
}

.filters__reset {
  position: absolute;
  z-index: 1;
  top: 50%;
  right: clamp(12px, 2vw, 24px);
  opacity: 1;
  transform: translateY(-50%);
}

@media (min-width: 840px) {
  .filters__content {
    padding-right: 64px !important;
  }
}

@media (max-width: 600px) {
  .filters__reset {
    top: 12px;
    transform: none;
  }
}
</style>
