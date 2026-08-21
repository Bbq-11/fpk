<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

import { getTrainById } from '@data/trains'
import { formatDate, formatDuration, formatPrice } from '@utils/format'

const props = defineProps<{
  id: string
}>()

const route = useRoute()
const { smAndDown } = useDisplay()
const router = useRouter()

const isDescExpanded = ref(!smAndDown.value)

const train = computed(() => getTrainById(props.id))

const departures = computed(() =>
  train.value ? [...train.value.departures].sort() : [],
)

const catalogRoute = computed(() => ({
  name: 'catalog',
  query: route.query,
}))

const returnToCatalog = () => {
  if (window.history.state?.back) {
    router.back()
    return
  }

  void router.push(catalogRoute.value)
}

watch(
  () => props.id,
  () => {
    isDescExpanded.value = !smAndDown.value
  },
)
</script>

<template>
  <VContainer class="app-container pt-3 pt-sm-4 pt-md-6 pb-8 pb-sm-12">
    <VBtn
      class="mb-2 mb-sm-3 px-0"
      color="primary"
      variant="text"
      prepend-icon="mdi-arrow-left"
      @click="returnToCatalog">
      К каталогу
    </VBtn>

    <template v-if="train">
      <VCard
        class="train-details rounded-xl bg-surface text-on-surface pa-3 pa-sm-4 pa-md-6 mb-3 mb-sm-4"
        variant="flat">
        <VCardText class="pa-0">
          <VChip
            color="secondary"
            variant="tonal"
            :size="smAndDown ? 'default' : 'large'">
            {{ train.region }}
          </VChip>

          <VRow
            class="align-start gr-3 gr-sm-4"
            no-gutters>
            <VCol
              class="pr-md-4"
              cols="12"
              md="9">
              <h1
                class="text-display-small text-sm-display-medium text-md-display-large font-weight-bold mt-0 mb-2 text-wrap-anywhere">
                {{ train.name }}
              </h1>
              <div
                id="train-description"
                class="description-collapse"
                :class="{ 'description-collapse--expanded': isDescExpanded }"
                :aria-hidden="!isDescExpanded">
                <div class="description-collapse__inner">
                  <p
                    class="text-body-medium text-sm-body-large text-muted mt-0 mb-2">
                    {{ train.description }}
                  </p>
                </div>
              </div>
              <VBtn
                class="px-0"
                color="primary"
                variant="text"
                density="compact"
                :append-icon="
                  isDescExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'
                "
                :aria-expanded="isDescExpanded"
                aria-controls="train-description"
                @click="isDescExpanded = !isDescExpanded">
                {{ isDescExpanded ? 'Скрыть описание' : 'Показать описание' }}
              </VBtn>
            </VCol>
            <VCol
              cols="12"
              md="3">
              <VCard
                class="rounded-xl"
                color="dark"
                variant="flat"
                aria-label="Покупка билета">
                <VCardText class="pa-4 pa-sm-5 pa-md-6">
                  <span
                    class="text-title-small text-sm-title-medium text-on-dark opacity-70">
                    Стоимость путешествия
                  </span>

                  <p class="text-title-small text-sm-title-medium mt-0 mb-3">
                    от
                    <strong
                      class="text-headline-small text-sm-headline-medium font-weight-bold ml-2">
                      {{ formatPrice(train.price_from) }}
                    </strong>
                  </p>

                  <VBtn
                    :href="train.buy_url"
                    color="secondary"
                    variant="flat"
                    size="large"
                    block
                    target="_blank"
                    rel="noopener noreferrer"
                    append-icon="mdi-open-in-new">
                    Купить билет
                  </VBtn>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>

          <VDivider
            class="my-4 my-sm-6 opacity-100"
            color="border" />

          <dl class="ma-0">
            <VRow
              class="gr-3"
              no-gutters>
              <VCol
                class="pr-md-4"
                cols="12"
                md="9">
                <dt class="text-body-small text-sm-body-medium text-muted mb-1">
                  Маршрут
                </dt>

                <dd
                  class="text-body-medium text-sm-body-large ma-0 font-weight-bold text-wrap-anywhere">
                  {{ train.route.join(' → ') }}
                </dd>
              </VCol>

              <VCol
                cols="12"
                md="3">
                <dt class="text-body-small text-sm-body-medium text-muted mb-1">
                  Длительность
                </dt>

                <dd
                  class="text-body-medium text-sm-body-large ma-0 font-weight-bold">
                  {{ formatDuration(train.duration_days) }}
                </dd>
              </VCol>
            </VRow>
          </dl>
        </VCardText>
      </VCard>

      <VCard
        class="rounded-xl bg-surface text-on-surface pa-3 pa-sm-4 pa-md-6 mb-3 mb-sm-4"
        variant="flat">
        <h2
          class="text-title-large text-sm-headline-small text-md-headline-medium font-weight-bold ma-0 mb-3 mb-sm-4">
          Даты отправления
        </h2>

        <VCardText class="pa-0">
          <div class="d-flex flex-wrap ga-2 ga-sm-3">
            <VChip
              v-for="departure in departures"
              :key="departure"
              class="train-details__date justify-center text-body-medium text-sm-body-large"
              color="surface-variant"
              variant="flat"
              :size="smAndDown ? 'default' : 'large'">
              <time :datetime="departure">
                {{ formatDate(departure) }}
              </time>
            </VChip>
          </div>
        </VCardText>
      </VCard>

      <VRow class="align-stretch ga-3 ga-sm-4">
        <VCol
          class="d-flex"
          cols="12"
          md="7">
          <VCard
            class="h-100 w-100 rounded-xl bg-surface text-on-surface pa-3 pa-sm-4 pa-md-6"
            variant="flat">
            <h2
              class="text-title-large text-sm-headline-small text-md-headline-medium font-weight-bold pa-0 ma-0 mb-3 mb-sm-4">
              Экскурсионная программа
            </h2>

            <VCardText class="pa-0">
              <VList class="ma-0 pa-0">
                <VListItem
                  v-for="excursion in train.excursions"
                  :key="excursion"
                  class="train-details__excursion-item ma-0 pa-0"
                  density="compact">
                  <template #prepend>
                    <VIcon
                      color="secondary"
                      icon="mdi-map-marker-outline"
                      size="20" />
                  </template>

                  <VListItemTitle
                    class="text-body-medium text-sm-body-large text-wrap">
                    {{ excursion }}
                  </VListItemTitle>
                </VListItem>
              </VList>
            </VCardText>
          </VCard>
        </VCol>

        <VCol
          class="d-flex"
          cols="12"
          md="5">
          <VCard
            class="h-100 w-100 rounded-xl bg-surface text-on-surface pa-3 pa-sm-4 pa-md-6"
            variant="flat">
            <h2
              class="text-title-large text-sm-headline-small text-md-headline-medium font-weight-bold pa-0 ma-0 mb-3 mb-sm-4">
              Особенности путешествия
            </h2>

            <VCardText class="d-flex flex-wrap ga-2 ga-sm-3 pa-0">
              <VChip
                v-for="tag in train.tags"
                :key="tag"
                color="primary"
                :size="smAndDown ? 'default' : 'large'"
                variant="tonal">
                {{ tag }}
              </VChip>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </template>

    <VCard
      v-else
      class="text-center rounded-xl bg-surface text-on-surface pa-4 pa-sm-6 pa-md-8"
      variant="flat"
      role="status">
      <VIcon
        color="muted"
        icon="mdi-train-off"
        size="40"
        aria-hidden="true" />

      <h1
        class="text-title-large text-sm-headline-small text-md-headline-medium font-weight-bold mt-3 mb-0">
        Поезд не найден
      </h1>

      <p class="text-body-medium text-sm-body-large text-muted mt-2 mb-4">
        Возможно, ссылка устарела или адрес указан неверно.
      </p>

      <VBtn
        color="secondary"
        variant="flat"
        size="large"
        prepend-icon="mdi-arrow-left"
        @click="returnToCatalog">
        Вернуться к каталогу
      </VBtn>
    </VCard>
  </VContainer>
</template>

<style scoped lang="scss">
.train-details {
  border-top: 4px solid rgb(var(--v-theme-secondary)) !important;

  &__date {
    flex: 1 1 220px;
    max-width: none;
  }

  &__excursion-item {
    min-height: 24px !important;
    padding-block: 2px !important;

    :deep(.v-list-item__spacer) {
      width: 10px;
    }
  }
}
.description-collapse {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 180ms ease,
    opacity 140ms ease;

  &--expanded {
    grid-template-rows: 1fr;
    opacity: 1;
  }

  &__inner {
    min-height: 0;
    overflow: hidden;
  }
}
</style>
