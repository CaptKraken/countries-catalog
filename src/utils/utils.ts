import { SortOption } from "../types";

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
