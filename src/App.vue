<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <VApp>
    <VAppBar
      class="border-b border-border"
      color="surface"
      height="72"
      elevation="0">
      <VContainer class="app-container d-flex align-center py-0">
        <VBtn
          :to="{ name: 'catalog' }"
          class="pa-0 pr-2"
          color="on-surface"
          variant="plain"
          :ripple="false"
          aria-label="Витрина туристических поездов">
          <VAvatar
            class="mr-3 text-caption font-weight-bold"
            color="secondary"
            rounded="lg"
            size="40">
            ФПК
          </VAvatar>

          <span class="text-body-1 font-weight-bold">
            Туристические поезда
          </span>
        </VBtn>
      </VContainer>
    </VAppBar>

    <VMain class="bg-background">
      <RouterView />
    </VMain>
  </VApp>
</template>
