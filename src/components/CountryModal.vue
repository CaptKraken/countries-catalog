<template>
  <Teleport to="body">
    <div
      v-if="props.open && props.country"
      class="fixed w-full h-full top-0 left-0 bg-transparent flex justify-center items-center"
    >
      <div class="bg-green-200 w-10/12 sm:w-2/3 p-4 overflow-y-auto z-10">
        <div class="w-full flex justify-between items-center mb-4">
          <h2 class="text-3xl font-bold">
            {{ props.country.name.official + " " + props.country.flag }}
          </h2>
          <button @click="props.close">
            <img src="../assets/close.png" class="w-4 h-4" />
          </button>
        </div>
        <div class="flex-col flex xl:flex-row w-full gap-4">
          <div class="w-full flex-col md:w-3/5 md:flex-row">
            <img :src="props.country.flags.png" class="w-full h-min mb-4" />
            <div class="text-sm sm:text-base lg:text-xl flex gap-2 md:flex-col">
              <a
                target="_blank"
                class="flex gap-2 items-center bg-green-300 hover:bg-green-400 transition-colors p-2 w-full cursor-pointer"
                :href="props.country.maps.googleMaps"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Google_Maps_icon_%282015-2020%29.svg/2048px-Google_Maps_icon_%282015-2020%29.svg.png"
                  class="w-10"
                />
                <span class="">View on Google Maps</span>
              </a>
              <a
                target="_blank"
                class="flex gap-2 items-center bg-green-300 hover:bg-green-400 transition-colors p-2 w-full cursor-pointer"
                :href="props.country.maps.openStreetMaps"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Openstreetmap_logo.svg/1024px-Openstreetmap_logo.svg.png"
                  class="w-10"
                />
                <span class="">View on Open Street Maps</span>
              </a>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-sm sm:text-base lg:text-xl">
              <span class="font-bold">Official Name: </span>
              <span>{{ props.country.name.official }}</span>
            </div>

            <div class="text-sm sm:text-base lg:text-xl">
              <span class="font-bold">Native Name: </span>
              <span>{{
                props.country.name.nativeName
                  ? Object.values(props.country.name.nativeName)
                      .map((c) => c.official)
                      .join(", ")
                  : "N/A"
              }}</span>
            </div>

            <div class="text-sm sm:text-base lg:text-xl">
              <span class="font-bold">Population: </span>
              <span>{{ props.country.population?.toLocaleString() }}</span>
            </div>

            <div class="text-sm sm:text-base lg:text-xl">
              <span class="font-bold">Area: </span>
              <span>{{ props.country.area?.toLocaleString() }} km²</span>
            </div>

            <div class="text-sm sm:text-base lg:text-xl">
              <span class="font-bold">Capital: </span>
              <span>{{
                props.country.capital ? props.country.capital.join(", ") : "N/A"
              }}</span>
            </div>

            <div class="text-sm sm:text-base lg:text-xl">
              <span class="font-bold">Currencies: </span>
              <span>{{
                props.country.currencies &&
                Object.values(props.country.currencies)
                  ? Object.values(props.country.currencies)
                      .map((c) => `(${c.symbol}) ${c.name}`)
                      .join(", ")
                  : "N/A"
              }}</span>
            </div>

            <div class="text-sm sm:text-base lg:text-xl">
              <span class="font-bold">Continent / Region / Sub Region: </span>
              <span>{{
                `${props.country.continents.join(", ") ?? "N/A"}` +
                " / " +
                `${props.country.region ?? "N/A"}` +
                " / " +
                `${props.country.subregion ?? "N/A"}`
              }}</span>
            </div>

            <div class="text-sm sm:text-base lg:text-xl">
              <span class="font-bold">Languages: </span>
              <span>{{
                props.country.languages
                  ? Object.values(props.country.languages)
                      .map((l) => l)
                      .join(", ")
                  : "N/A"
              }}</span>
            </div>
            <div class="text-sm sm:text-base lg:text-xl">
              <span class="font-bold">Border: </span>
              <span>{{
                props.country.borders
                  ? props.country.borders
                      .map((b) =>
                        states.countries
                          .filter((c) => {
                            if (c.cca3 !== b) return false;
                            return true;
                          })
                          .map((c) => c.name.common)
                      )
                      .join(", ")
                  : "N/A"
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="fixed top-0 left-0 bg-black opacity-50 w-full h-full"
        @click="props.close"
      ></div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, PropType, ref } from "vue";
import { useCountryStore } from "../state/countries";
import { ICountry } from "../types";

const states = useCountryStore();

const props = defineProps({
  open: {
    required: true,
    type: Boolean,
  },
  close: {
    required: true,
    type: Function,
  },
  country: {
    required: false,
    type: Object as PropType<ICountry>,
  },
});
</script>

<style scoped></style>
