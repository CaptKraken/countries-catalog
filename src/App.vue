<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useCountryStore } from "./state/countries";
import { sortFunction } from "./utils/utils";
import { SortOption } from "./types";

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
    <p v-if="useCountryStore().countries.length < 1">loading data...</p>
    <div v-if="countries.length > 0" class="overflow-auto">
      <table class="w-full my-2 table-auto border-spacing-4">
        <thead>
          <tr>
            <th class="py-2 text-left">Flag</th>
            <th class="py-2 text-left">Official Name</th>
            <th class="py-2 text-left">Native Names</th>
            <th class="py-2 text-left">Alternative Names</th>
            <th class="py-2 text-left">CCA2</th>
            <th class="py-2 text-left">CCA3</th>
            <th class="py-2 text-left">Calling Code</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(c, i) in countries"
            :key="c.name.official"
            class="hover:bg-green-400 cursor-pointer"
            :class="i % 2 === 0 ? 'bg-green-200' : 'bg-white'"
          >
            <td>
              <img :src="c.flags.png" class="w-8" />
            </td>
            <td>
              <span class="ml-2">
                {{ c.name.official }}
              </span>
            </td>
            <td>
              {{
                c.name.nativeName
                  ? Object.values(c.name.nativeName)
                      .map((v) => v.official)
                      .slice(0, 1)
                      .join(",\n")
                  : "---"
              }}
            </td>
            <td>
              {{ c.altSpellings.slice(0, 3).join(", ") }}
            </td>
            <td>
              {{ c.cca2 }}
            </td>
            <td>
              {{ c.cca3 }}
            </td>
            <td class="max-w-xs py-2">
              <span
                class="max-h-24 overflow-x-hidden overflow-auto h-18 flex items-center"
              >
                {{
                  c.idd.suffixes
                    ? c.idd.suffixes?.map((v) => c.idd.root + v).join(", ")
                    : "---"
                }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
