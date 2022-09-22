<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useCountryStore } from "./state/countries";
import { sortFunction } from "./utils/utils";
import { SortOption } from "./types";
import CountryTable from "./components/CountryTable.vue";

const countryStore = useCountryStore();
const sortOption = ref<SortOption>("asc");
const countries = computed(() =>
  countryStore.countries.sort((a, b) =>
    sortFunction(a.name.official, b.name.official, sortOption.value)
  )
);

onMounted(async () => {
  // fetch all the countries
  await useCountryStore().getAllCountries();
});
</script>

<template>
  <header class="w-full flex items-center justify-center my-4">
    <h1 class="text-2xl font-semibold">COUNTRY CATALOG</h1>
  </header>
  <main>
    <select v-model="sortOption">
      <option value="asc">a-z</option>
      <option value="desc">z-a</option>
    </select>
    <p v-if="countries.length < 1">loading data...</p>
    <CountryTable :countries="countries" />
  </main>
</template>
