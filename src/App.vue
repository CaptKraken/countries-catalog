<script setup lang="ts">
import { useCountryStore } from "./state/countries";
import {
  sortFunction,
  orderCountriesByName,
  paginateCountries,
  setTitle,
} from "./utils/utils";
import { SortOption } from "./types";
import CountryTable from "./components/CountryTable.vue";
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from "vue";

const countryStore = useCountryStore();
const sortOption = ref<SortOption>("asc");
const countries = computed(() => countryStore.countries);

onMounted(async () => {
  // fetch all the countries
  await useCountryStore().getAllCountries();
});

onBeforeMount(() => {
  setTitle("Country Catalog");
});

const searchedCountries = computed(() => {
  if (!term.value) {
    return countries.value;
  }

  return countries.value.filter((v) => {
    const searchTerm = term.value.toLowerCase();
    const countryName = v.name.official.toLowerCase();

    // if the country name contains the search term put in the new array.
    if (countryName.includes(searchTerm)) return true;

    // slice the country name to match the search term length, then split to make an array
    const slicedName = countryName.slice(0, term.value.length).split("");

    // keeps track of differences
    let diffs = 0;

    // look for differnces between the sliced name and the search term
    slicedName.forEach((ch, i) => ch !== searchTerm[i] && diffs++);

    // if it's off more than 1 character, dont put in the array
    if (diffs > 1) return false;

    return true;
  });
});

const sortedCountries = computed(() => {
  // if not search term, do normal sorting
  if (!term.value) {
    return orderCountriesByName(searchedCountries.value, sortOption.value);
  }

  // fuzzy sort implementation
  return searchedCountries.value.sort((a, b) => {
    const aName = a.name.official.toLowerCase();
    const bName = b.name.official.toLowerCase();
    const searchTerm = term.value.toLowerCase();
    const isAStartedWithTerm = aName.startsWith(searchTerm);
    const isBStartedWithTerm = bName.startsWith(searchTerm);

    // if both aName and bName start with the search term, do normal sort.
    if (isAStartedWithTerm && isBStartedWithTerm) {
      return sortFunction(aName, bName, sortOption.value);
    }

    // if only aName starts with the search term,
    if (isAStartedWithTerm) {
      // returns a first.
      return sortOption.value === "asc" ? -1 : 1;
    }

    // if only bName starts with the search term,
    if (isBStartedWithTerm) {
      // returns b first.
      return sortOption.value === "asc" ? 1 : -1;
    }

    // if both aName and bName contain the search term, do normal sort.
    if (aName.includes(searchTerm) && bName.includes(searchTerm)) {
      return sortFunction(aName, bName, sortOption.value);
    }

    // if only aName starts with the search term,
    if (aName.includes(searchTerm)) {
      // returns a first.
      return sortOption.value === "asc" ? -1 : 1;
    }

    // if only bName starts with the search term,
    if (bName.includes(searchTerm)) {
      // returns b first.
      return sortOption.value === "asc" ? 1 : -1;
    }

    return sortFunction(aName, bName, sortOption.value);
  });
});

// pagination
const pageInfo = reactive({
  pageNumber: 1,
  pageSize: 25,
});

const resetPageInfo = () => {
  pageInfo.pageNumber = 1;
  pageInfo.pageSize = 25;
};

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

// search
const term = ref<string>("");
const clearSearchBox = () => {
  term.value = "";
};
watch(
  () => term.value,
  () => {
    resetPageInfo();
  }
);
</script>

<template>
  <header class="w-full flex items-center justify-center my-4">
    <h1 class="text-2xl font-semibold">COUNTRY CATALOG</h1>
  </header>
  <main>
    <div class="w-full flex justify-center">
      <div
        class="bg-green-200 focus-within:bg-green-300 max-w-lg w-full p-2 flex items-center gap-2"
      >
        <img src="./assets/search.png" class="w-4 h-4" />
        <input
          type="text"
          placeholder="Search for a country..."
          class="w-full bg-transparent outline-none"
          v-model="term"
        />
        <button @click="clearSearchBox">
          <img src="./assets/close.png" class="w-4 h-4" />
        </button>
        <select v-model="sortOption">
          <option value="asc">a-z</option>
          <option value="desc">z-a</option>
        </select>
      </div>
    </div>

    <div class="px-2 md:px4">
      <p v-if="countries.length < 1">loading data...</p>
      <CountryTable :countries="paginatedCountries" />
    </div>
  </main>
  <footer class="py-4">
    <div class="w-full flex justify-center py-2">
      <p v-if="!term">
        Showing {{ shownRange.from }} - {{ shownRange.to }} of
        {{ countries.length }}
      </p>
      <p v-if="term">Found {{ paginatedCountries.length }} results.</p>
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
