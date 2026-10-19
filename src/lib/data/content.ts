/** @deprecated use `@/lib/data/news` */
export { newsItems } from "./news";

export const campaigns = [
  {
    id: "c1",
    title: {
      az: '"ABB Play - Master Liqa" ilə futbol həyəcanı qayıdır!',
      en: '"ABB Play - Master League" football excitement is back!',
    },
    desc: {
      az: "ABB-dən futbol azarkeşləri üçün qazandıran kampaniya",
      en: "A rewarding campaign for football fans from ABB",
    },
    color: "from-emerald-500 to-teal-700",
  },
  {
    id: "c2",
    title: {
      az: "ABB-də Nağd Kreditə 7%-dək Endirim!",
      en: "Up to 7% discount on cash loans at ABB!",
    },
    desc: {
      az: "Kreditini ABB-yə gətirənlərə faiz endirimi və komissiyasız nağd kredit fürsəti",
      en: "Rate discount and commission-free cash loan when you refinance with ABB",
    },
    color: "from-blue-500 to-indigo-700",
  },
  {
    id: "c3",
    title: {
      az: "Green by Avant-da mənzil sahibi olmaq daha əlçatandır",
      en: "Owning a home at Green by Avant is more accessible",
    },
    desc: {
      az: "Mənzil dəyərinin yalnız 10%-ni ilkin ödəniş olaraq ödəyin!",
      en: "Pay only 10% of the property value as a down payment!",
    },
    color: "from-lime-500 to-green-700",
  },
  {
    id: "c4",
    title: {
      az: 'Travel Card Visa Signature ilə "Sea Breeze Marina"da yaxta gəzintisi!',
      en: 'Yacht trip at "Sea Breeze Marina" with Travel Card Visa Signature!',
    },
    desc: {
      az: '"Sea Breeze Marina"da eksklüziv yay təcrübəsi yaşayın',
      en: 'Enjoy an exclusive summer experience at "Sea Breeze Marina"',
    },
    color: "from-sky-500 to-blue-800",
  },
];

export const exchangeRates = [
  { code: "USD", buy: 1.697, sell: 1.702 },
  { code: "EUR", buy: 1.8712, sell: 1.9266 },
  { code: "100 RUB", buy: 1.91, sell: 2.06 },
];

export const calculatorDefaults = {
  credit: { amount: 10000, term: 12, rate: 12, min: 500, max: 70000 },
  deposit: { amount: 1000, term: 12, rate: 8.5, min: 100, max: 500000 },
  auto: { amount: 20000, term: 36, rate: 11, min: 3000, max: 100000 },
  mortgage: { amount: 80000, term: 120, rate: 8, min: 10000, max: 500000 },
};
