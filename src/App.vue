<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useCountryStore } from "./state/countries";
import {
  sortFunction,
  orderCountriesByName,
  paginateCountries,
} from "./utils/utils";
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

const sortedCountries = computed(() => {
  return orderCountriesByName(countries.value, sortOption.value);
});

// pagination
const pageInfo = reactive({
  pageNumber: 1,
  pageSize: 25,
});

const paginatedCountries = computed(() => {
  return paginateCountries(
    sortedCountries.value,
    pageInfo.pageNumber,
    pageInfo.pageSize
  );
});

const shownRange = computed(() => {
  const from =
    pageInfo.pageNumber === 1
      ? 1
      : (pageInfo.pageNumber - 1) * pageInfo.pageSize;
  const to = pageInfo.pageNumber * pageInfo.pageSize;

  return { from, to };
});

const totalPageCount = computed(() =>
  sortedCountries.value.length > 0
    ? // round up
      Math.ceil(sortedCountries.value.length / 25)
    : 0
);

const goToPage = (pageNumber: number) => {
  if (
    pageNumber !== pageInfo.pageNumber ||
    pageNumber > totalPageCount.value ||
    pageNumber < 1
  ) {
    pageInfo.pageNumber = pageNumber;
  }
};

const nextPage = () => {
  if (pageInfo.pageNumber < totalPageCount.value) {
    pageInfo.pageNumber++;
  }
};
const previousPage = () => {
  if (pageInfo.pageNumber - 1 > 0) {
    pageInfo.pageNumber--;
  }
};
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
    <CountryTable :countries="paginatedCountries" />
  </main>
  <footer class="py-4">
    <div class="w-full flex justify-center py-2">
      <p>
        Showing {{ shownRange.from }} - {{ shownRange.to }} of
        {{ countries.length }}
      </p>
    </div>
    <div
      class="flex gap-2 w-full justify-center flex-wrap"
      v-if="totalPageCount > 1"
    >
      <button
        @click="previousPage"
        aria-label="previous"
        class="bg-green-200 px-3 py-2"
      >
        <img src="./assets/back.png" class="w-5" />
      </button>
      <button
        v-for="i in totalPageCount"
        :key="i"
        @click="goToPage(i)"
        class="bg-green-200 px-4 py-2"
        :class="i === pageInfo.pageNumber ? 'bg-green-400' : ''"
      >
        <span>{{ i }}</span>
      </button>
      <button
        @click="nextPage"
        aria-label="next"
        class="bg-green-200 px-3 py-2"
      >
        <img src="./assets/next.png" class="w-5" />
      </button>
    </div>
  </footer>
</template>
