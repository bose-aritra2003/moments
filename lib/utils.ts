import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNowStrict } from 'date-fns'
import locale from 'date-fns/locale/en-US'
import { generateUsername } from "unique-username-generator";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
}

const formatDistanceLocale = {
  lessThanXSeconds: 'just now',
  xSeconds: 'just now',
  halfAMinute: 'just now',
  lessThanXMinutes: '{{count}}m',
  xMinutes: '{{count}}m',
  aboutXHours: '{{count}}h',
  xHours: '{{count}}h',
  xDays: '{{count}}d',
  aboutXWeeks: '{{count}}w',
  xWeeks: '{{count}}w',
  aboutXMonths: '{{count}}m',
  xMonths: '{{count}}m',
  aboutXYears: '{{count}}y',
  xYears: '{{count}}y',
  overXYears: '{{count}}y',
  almostXYears: '{{count}}y',
}

const formatDistance = (token: string, count: number, options?: any): string => {
  options = options || {}

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace('{{count}}', count.toString())

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return 'in ' + result
    } else {
      if (result === 'just now') return result
      return result + ' ago'
    }
  }

  return result
}

export const formatTimeToNow = (date: Date): string => {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  })
}

export const getRandomUsername = () => {
  return generateUsername("-", 0, 24) + Math.floor(Math.random() * (899999) + 100000);
}

export const nFormatter = (num: number, digits: number) => {
  const sign = Math.sign(num);
  const absNum = Math.abs(num);
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup.slice().reverse().find(function(item) {
    return absNum >= item.value;
  });
  const res = item ? (absNum / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  return sign === -1 ? '-' + res : res;
}