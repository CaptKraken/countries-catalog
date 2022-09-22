import { ICountry, SortOption } from "../types";

/**
 * a generic sort function with ascending/descending option.
 * @param {String|Number} a
 * @param {String|Number} b
 * @param {"asc" | "desc"} order "asc" | "desc"
 */
export const sortFunction = (
  a: string | number,
  b: string | number,
  order: SortOption = "asc"
) => {
  if (a < b) {
    return order === "asc" ? -1 : 1;
  }
  if (a > b) {
    return order === "asc" ? 1 : -1;
  }
  return 0;
};

export const orderCountriesByName = (
  array: ICountry[],
  order: "asc" | "desc" = "asc"
) => {
  return array.sort((a, b) => {
    const countryA = a.name.official.toLowerCase();
    const countryB = b.name.official.toLowerCase();
    return sortFunction(countryA, countryB, order);
  });
};

/**
 * pagainate an array
 * @param {Array} array the array itself
 * @param {Number} pageNumber human readable, starts at 1 (default: 1)
 * @param {Number} pageSize the number of items for each page (default: 25)
 * @returns a new array of results
 */
export const paginateCountries = (
  array: ICountry[],
  pageNumber: number = 1,
  pageSize: number = 25
) => {
  const lastIndex = pageNumber * pageSize;
  return array.slice((pageNumber - 1) * pageSize, lastIndex);
};
