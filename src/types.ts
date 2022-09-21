type PostalCode = {
  format: string;
  regex: string;
};

type CountryName = {
  common: string;
  official: string;
  nativeName: {
    [key: string]: Translation;
  };
};

type Currency = {
  name: string;
  symbol: string;
};

type IID = {
  root: string;
  suffixes: string[];
};

type Translation = {
  official: string;
  common: string;
};

type Maps = {
  googleMaps: string;
  openStreetMaps: string;
};

type Images = {
  png: string;
  svg: string;
};

type Car = {
  signs: string[];
  side: string;
};

export interface ICountry {
  name: CountryName;
  tld: string[];
  cca2: string;
  ccn3: string;
  cca3: string;
  cioc: string;
  independent: boolean;
  status: string;
  unMember: boolean;
  currencies: {
    [key: string]: Currency;
  };
  idd: IID;
  capital: string[];
  altSpellings: string[];
  region: string;
  subregion: string;
  languages: {
    [key: string]: string;
  };
  translations: {
    [key: string]: Translation;
  };
  latlng: number[];
  landlocked: boolean;
  borders: string[];
  area: number;
  demonyms: {
    [key: string]: {
      f: string;
      m: string;
    };
  };
  flag: string;
  maps: Maps;
  population: number;
  gini: {
    [key: number]: number;
  };
  fifa: string;
  car: Car;
  timezones: string[];
  continents: string[];
  flags: Images;
  coatOfArms: Images;
  startOfWeek: "monday" | "sunday";
  capitalInfo: {
    latlng: number[];
  };
  postalCode: PostalCode;
}
