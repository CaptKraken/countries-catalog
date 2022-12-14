<template>
  <CountryModal :open="open" :close="closeModal" :country="viewingCountry" />
  <div v-if="props.countries.length > 0" class="overflow-auto">
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
          v-for="(c, i) in props.countries"
          :key="c.name.official"
          class="hover:bg-green-400 cursor-pointer"
          :class="i % 2 === 0 ? 'bg-green-200' : 'bg-white'"
          @click="openModal(c)"
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
</template>

<script setup lang="ts">
import { PropType, ref, watch } from "vue";
import { ICountry } from "../types";
import { setTitle } from "../utils/utils";
import CountryModal from "./CountryModal.vue";

const props = defineProps({
  countries: {
    required: true,
    type: Array as PropType<ICountry[]>,
  },
});

const viewingCountry = ref<ICountry | undefined>(undefined);

const open = ref<boolean>(false);
const openModal = (country: ICountry) => {
  open.value = true;
  viewingCountry.value = country;
  setTitle(country.name.official);
};

const closeModal = () => {
  open.value = false;
  viewingCountry.value = undefined;
  setTitle("Country Catalog");
};

watch(
  () => open.value,
  () => {
    if (open.value) {
      document.documentElement.style.overflow = "hidden";
      return;
    }
    document.documentElement.style.overflow = "auto";
  }
);
</script>
