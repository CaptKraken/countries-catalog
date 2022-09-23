import { defineStore } from "pinia";
import { ICountry } from "../types";

const initState: {
  countries: ICountry[];
} = {
  countries: [],
};

export const useCountryStore = defineStore("countries", {
  state: () => initState,
  getters: {},
  actions: {
    async getAllCountries() {
      const countries = await fetch("https://restcountries.com/v3.1/all")
        .then((data) => data.json())
        .catch((err) => {
          //
        });
      if (countries) {
        this.countries.push(...countries);
      }
    },
  },
});
