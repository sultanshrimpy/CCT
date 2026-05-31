import { createSignal } from "solid-js";

import dayjs from "dayjs";
import locale_en_GB from "dayjs/esm/locale/en-gb.js";
import advancedFormat from "dayjs/plugin/advancedFormat";
import calendar from "dayjs/plugin/calendar";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

import { type LocaleOptions, LanguageEntry, Languages } from "./Languages";

dayjs.extend(calendar);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);
dayjs.extend(updateLocale);

const defaultLocale: ILocale = {
  name: "en",
  formats: {
    LT: "h:mm A",
    LTS: "h:mm:ss A",
    L: "MM/DD/YYYY",
    LL: "MMMM D, YYYY",
    LLL: "MMMM D, YYYY h:mm A",
    LLLL: "dddd, MMMM D, YYYY h:mm A",
  },
  relativeTime: {
    future: "in %s", past: "%s ago", s: "a few seconds", m: "a minute",
    mm: "%d minutes", h: "an hour", hh: "%d hours", d: "a day",
    dd: "%d days", M: "a month", MM: "%d months", y: "a year", yy: "%d years",
  },
  weekdays: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
  months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
};

const [timeLocale, setTimeLocale] = createSignal<[string, ILocale]>(["en", defaultLocale]);

export { dayjs, timeLocale };

export async function loadTimeLocale(
  language: LanguageEntry,
  localeOptions: LocaleOptions,
  useLocale?: ILocale,
) {
  const target = language.dayjs ?? language.i18n;
  const locale =
    useLocale ??
    LOCALE_OVERRIDES[target] ??
    ((await import(`../../node_modules/dayjs/esm/locale/${target}.js`).then(
      (module) => module.default,
    )) as ILocale);

  // merge options for calendar (hardcoded English)
  (locale as unknown as { calendar: Record<string, string> }).calendar = {
    lastDay: "[Yesterday at] LT",
    sameDay: "[Today at] LT",
    nextDay: "[Tomorrow at] LT",
    lastWeek: "[Last] dddd [at] LT",
    nextWeek: "dddd [at] LT",
    sameElse: "L",
  };

  const options = {
    ...language.localeOptions,
    ...localeOptions,
  };

  updateTimeLocaleOptions(options, target, locale);
}

export function updateTimeLocaleOptions(
  options: LocaleOptions,
  target?: string,
  useLocale?: ILocale,
) {
  const [currentTarget, currentLocale] = timeLocale();
  target = target ?? currentTarget;
  useLocale = useLocale ?? currentLocale;

  const locale = {
    ...useLocale,
    formats: {
      ...useLocale.formats,
      L: options.dateFormat ?? useLocale.formats.L,
      LT: options.timeFormat ?? useLocale.formats.LT,
    },
  };

  setTimeLocale([target, locale]);
}

export function initTime() {
  loadTimeLocale(Languages.en, {}, locale_en_GB);
}

export function useTime() {
  // eslint-disable-next-line solid/reactivity
  return (date?: dayjs.ConfigType) => dayjs(date).locale(...timeLocale());
}

const locale_en_US: ILocale & { yearStart: number } = {
  name: "en",
  weekdays: locale_en_GB["weekdays"],
  weekdaysShort: locale_en_GB["weekdaysShort"],
  weekdaysMin: locale_en_GB["weekdaysMin"],
  months: locale_en_GB["months"],
  monthsShort: locale_en_GB["monthsShort"],
  weekStart: locale_en_GB["weekStart"],
  yearStart: (locale_en_GB as never as { yearStart: number })["yearStart"],
  relativeTime: locale_en_GB["relativeTime"],
  formats: {
    LT: "h:mm A",
    LTS: "h:mm:ss A",
    L: "MM/DD/YYYY",
    LL: "MMMM D, YYYY",
    LLL: "MMMM D, YYYY h:mm A",
    LLLL: "dddd, MMMM D, YYYY h:mm A",
  },
  ordinal: locale_en_GB["ordinal"],
};

const LOCALE_OVERRIDES: Record<string, ILocale> = {
  "en-gb": locale_en_GB,
  en: locale_en_US,
};
