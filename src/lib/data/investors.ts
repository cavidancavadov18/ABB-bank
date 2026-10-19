export type InvestorMetric = { value: string; label: string };
export type InvestorRatio = {
  value: string;
  label: string;
  note: string;
};
export type InvestorPress = { title: string; date: string; href: string };
export type InvestorDoc = { title: string; meta: string; href: string };
export type InvestorFaq = { q: string; a: string };
export type InvestorRating = { label: string; value: string };

export const investorsAz = {
  title: "ABB ilə gələcəyinizə investisiya edin!",
  subtitle:
    "Maliyyə gələcəyinizi təmin etmək üçün ABB ilə müxtəlif investisiya imkanlarını araşdırın.",
  heroImage: "https://cdn.abb-bank.az/image_22_76a3860079.png",
  metricsTitle:
    "Konsolidasiya olunmuş hesabata əsasən 2025-ci ilin əsas maliyyə göstəriciləri",
  metrics: [
    { value: "404,491 ₼", label: "Xalis mənfəət (bazarda 1-ci)" },
    { value: "14,266,487", label: "Aktivlər" },
    { value: "6.2%", label: "Xalis faiz marjası" },
    { value: "16.7%", label: "Kapitalın rentabelliyi (ROE)" },
    { value: "2.8%", label: "Aktivlərin gəlirliliyi (ROA)" },
    { value: "41.38%", label: "Gəlirə nisbətən xərc" },
    { value: "0.04", label: "Səhm başına dividend (DPS)" },
    { value: "3.17", label: "Səhmin qiymətinin mənfəətə nisbəti (P/E ratio)" },
  ] satisfies InvestorMetric[],
  ratiosTitle: "Maliyyə hesabatları üzrə əmsallar",
  ratiosSubtitle: "Əsas göstəricilər",
  years: ["2020", "2021", "2022", "2023", "2024", "2025"],
  defaultYear: "2025",
  ratiosByYear: {
    "2025": [
      {
        value: "31.60%",
        label: "Səhm gəlirliliyi",
        note: "Hesablamalar səhmlərin nominal dəyərinə əsasən aparılmışdır (0,27 AZN)",
      },
      {
        value: "15.6%",
        label: "Dividend gəlirliliyi",
        note: "Hesablamalar səhmlərin nominal dəyərinə əsasən aparılmışdır (0,27 AZN)",
      },
      {
        value: "0.09 AZN",
        label: "Bir səhm üzrə mənfəət",
        note: "Hesablamalar səhmlərin nominal dəyərinə əsasən aparılmışdır (0,27 AZN)",
      },
      {
        value: "200 mln. AZN",
        label: "Ödənilmiş dividendlər",
        note: "Dividendlər əvvəlki ilin maliyyə nəticələri ilə bağlı kənar audit hesabatı təsdiqləndikdən sonra növbəti ilin birinci yarısında ödənilir.",
      },
    ],
    "2024": [
      {
        value: "28.4%",
        label: "Səhm gəlirliliyi",
        note: "Hesablamalar səhmlərin nominal dəyərinə əsasən aparılmışdır (0,27 AZN)",
      },
      {
        value: "14.2%",
        label: "Dividend gəlirliliyi",
        note: "Hesablamalar səhmlərin nominal dəyərinə əsasən aparılmışdır (0,27 AZN)",
      },
      {
        value: "0.08 AZN",
        label: "Bir səhm üzrə mənfəət",
        note: "Hesablamalar səhmlərin nominal dəyərinə əsasən aparılmışdır (0,27 AZN)",
      },
      {
        value: "180 mln. AZN",
        label: "Ödənilmiş dividendlər",
        note: "Dividendlər əvvəlki ilin maliyyə nəticələri ilə bağlı kənar audit hesabatı təsdiqləndikdən sonra növbəti ilin birinci yarısında ödənilir.",
      },
    ],
  } as Record<string, InvestorRatio[]>,
  ratiosFootnote:
    "*Hesablamalar səhmlərin nominal dəyəri (0,27 manat) üzərindən aparılmışdır.",
  ratingsTitle: "Reytinqlər",
  ratingsDesc:
    "Reytinqlər şirkətimizin maliyyə gücünü və etibarlılığını təsdiqləyən əsas göstəricilərdir",
  ratingTabs: ["Fitch reytinqləri", "Moody's İnvestorlar Xidməti"] as const,
  ratings: {
    "Fitch reytinqləri": {
      items: [
        { label: "Uzunmüddətli emitentin defolt reytinqi", value: "BB+" },
        { label: "Qısamüddətli emitentin defolt reytinqi", value: "B" },
        { label: "Dayanıqlıq reytinqi", value: "bb+" },
        { label: "Dövlət dəstəyi reytinqi", value: "ns" },
        { label: "Proqnoz", value: "Stabil" },
      ] satisfies InvestorRating[],
      updated: "Son yenilənmə: 07.08.2026",
      issued: "Reytinq verilmə tarixi: 07.08.2026",
    },
    "Moody's İnvestorlar Xidməti": {
      items: [
        { label: "Uzunmüddətli bank depozit reytinqi", value: "Ba2" },
        { label: "Qısamüddətli bank depozit reytinqi", value: "NP" },
        { label: "Bazis kredit qiymətləndirməsi", value: "ba2" },
        { label: "Proqnoz", value: "Stabil" },
      ] satisfies InvestorRating[],
      updated: "Son yenilənmə: 2025",
      issued: "Moody's İnvestorlar Xidməti",
    },
  },
  pressTitle: "Press-relizlər",
  pressAll: "Bütün xəbərlərə keçid edin",
  press: [
    {
      title: "ABB Səhmdarlarının Ümumi Yığıncağı keçirilib",
      date: "02.10.2026",
      href: "/press-relizler/abb-sehmdarlarinin-umumi-yigincagi-kecirilib-0210",
    },
    {
      title:
        "ABB ilə Davr Bank arasında əqd prosesinin tamamlanması xəbəri qlobal finance.yahoo.com portalında",
      date: "14.09.2026",
      href: "/press-relizler/abb-ile-davr-bank-arasinda-eqd-prosesinin-tamamlanmasi-xeberi-qlobal-financeyahoocom-portalinda",
    },
    {
      title: "Qlobal finance.yahoo.com portalı ABB Davr haqqında yazdı",
      date: "27.08.2026",
      href: "/press-relizler/qlobal-financeyahoocom-portali-abb-davr-haqqinda-yazdi",
    },
    {
      title: "Səhmdarların nəzərinə!",
      date: "18.08.2026",
      href: "/press-relizler/sehmdarlarin-nezerine",
    },
    {
      title: "Euronews ABB-nin süni intellekt təcrübəsindən yazdı",
      date: "27.07.2026",
      href: "/press-relizler/euronews-abb-nin-suni-intellekt-tecrubesinden-yazdi",
    },
    {
      title:
        "Qlobal finance.yahoo.com portalı ABB-nin süni intellekt əsaslı fərdi maliyyə menecerləri haqqında yazdı",
      date: "04.06.2026",
      href: "/press-relizler/qlobal-financeyahoocom-portali-abb-nin-suni-intellekt-esasli-ferdi-maliyye-menecerleri-haqqinda-yazdi",
    },
  ] satisfies InvestorPress[],
  docsTitle: "Sənədlər",
  docTabs: [
    "Dayanıqlı İnkişaf Hesabatları",
    "Korporativ təqdimat",
    "Səhmdarlar",
    "ABB istiqrazları",
    "Maliyyə vəziyyəti",
    "Mənfəət və zərər",
    "Kapital adekvatlığı",
    "Digər sənədlər",
  ] as const,
  docs: {
    "Dayanıqlı İnkişaf Hesabatları": [
      {
        title: "ABB Dayanıqlı İnkişaf Hesabatı 2024",
        meta: "PDF 14.2 MB",
        href: "https://abb-bank.az/investorlarla-elaqe",
      },
      {
        title: "ABB Dayanıqlı İnkişaf Hesabatı 2023",
        meta: "PDF 15.9 MB",
        href: "https://abb-bank.az/investorlarla-elaqe",
      },
      {
        title: "ABB Dayanıqlı İnkişaf Hesabatı 2022",
        meta: "PDF 5.6 MB",
        href: "https://abb-bank.az/investorlarla-elaqe",
      },
    ],
  } as Record<string, InvestorDoc[]>,
  faqTitle: "Tez-tez verilən suallar",
  faqs: [
    {
      q: "ABB səhmləri nədir?",
      a: "ABB səhmləri bankın nizamnamə kapitalında payı təsdiq edən qiymətli kağızlardır. Səhmdarlar bankın mənfəətindən dividend almaq və ümumi yığıncaqlarda iştirak etmək hüququna malikdirlər.",
    },
    {
      q: "Dividend nədir?",
      a: "Dividend səhmdarlara bankın xalis mənfəətindən pay olaraq ödənilən məbləğdir. Dividend məbləği və ödəniş qaydası səhmdarların ümumi yığıncağı tərəfindən müəyyən edilir.",
    },
    {
      q: "ABB öz səhmdarlarına nə qədər dividend ödəyir?",
      a: "Dividend məbləği hər il maliyyə nəticələrinə və səhmdarların ümumi yığıncağının qərarına əsasən müəyyən olunur. Son dövrdə bir səhm üzrə dividend və ümumi ödəniş məbləğləri investor səhifəsində dərc edilir.",
    },
    {
      q: "Dividendlərdən vergi tutulurmu?",
      a: "Bəli, qüvvədə olan qanunvericiliyə uyğun olaraq dividendlərdən vergi tutula bilər. Dəqiq vergi rejimi səhmdarın statusundan asılı olaraq dəyişə bilər.",
    },
    {
      q: "ABB səhmlərini kim ala bilər?",
      a: "Qanunvericiliklə nəzərdə tutulmuş qaydada fiziki və hüquqi şəxslər ABB səhmlərini əldə edə bilərlər. Alış prosesi fond birjasında və ya digər qanuni kanallar vasitəsilə həyata keçirilir.",
    },
    {
      q: "ABB səhmlərini satmaq mümkündürmü?",
      a: "Bəli, ABB səhmləri qüvvədə olan bazar qaydalarına uyğun olaraq satıla bilər. Satış əməliyyatları müvafiq broker və ya birja mexanizmləri vasitəsilə aparılır.",
    },
    {
      q: "Üstünlük hüququ olan səhmdarlar kimdir?",
      a: "Üstünlük hüququndan istifadə imkanı barədə bildirişi sifarişli poçt göndərişi ilə əldə etmiş və bildiriş alındığı tarixdən on iş günü ərzində ABB-yə tələbini təqdim etmiş səhmdardır.",
    },
  ] satisfies InvestorFaq[],
};

export const investorsEn = {
  ...investorsAz,
  title: "Invest in your future with ABB!",
  subtitle:
    "Explore a range of investment opportunities with ABB to secure your financial future.",
  metricsTitle:
    "Key financial indicators for 2025 based on the consolidated report",
  ratiosTitle: "Financial statement ratios",
  ratiosSubtitle: "Key figures",
  ratingsTitle: "Ratings",
  ratingsDesc:
    "Ratings are key indicators confirming our financial strength and reliability",
  pressTitle: "Press releases",
  pressAll: "View all news",
  docsTitle: "Documents",
  faqTitle: "Frequently asked questions",
};
