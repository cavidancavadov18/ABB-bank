import fs from "fs";

const path = "src/lib/data/sectionPages.json";
const j = JSON.parse(fs.readFileSync(path, "utf8"));

const nl = "\n\n";

j["/ferdi/kartlar/debet-kartlari"].contentSections = [
  {
    title: "Debet kartı nədir və nə üçün istifadə olunur?",
    desc: [
      "Debet kartı birbaşa sizin hesabınızdakı vəsaitə bağlı olan ödəniş kartıdır. Yəni kartla etdiyiniz əməliyyatlar mövcud balansınız çərçivəsində həyata keçirilir. Bu xüsusiyyət debet kartını gündəlik maliyyə idarəçiliyi üçün rahat və nəzarətli seçimə çevirir.",
      "Debet kartları ilə mağazada ödəniş etmək, onlayn alış-veriş aparmaq, ATM-dən nağd vəsait çıxarmaq, kartdan karta köçürmə etmək və müxtəlif xidmət haqlarını ödəmək mümkündür. Bir sözlə, bu kartlar həm gündəlik istifadə, həm də rəqəmsal bankçılıq üçün vacib alətə çevrilib.",
    ].join(nl),
  },
  {
    title: "Gündəlik ödənişlər üçün doğru debet kartını necə seçmək olar?",
    desc: [
      "Debet kartları bu gün həm gündəlik xərcləri rahat idarə etmək, həm də nağdsız ödənişlərin üstünlüklərindən yararlanmaq üçün ən praktik bank məhsullarından biridir. Maaşın qəbulundan market alış-verişinə, onlayn sifarişlərdən səyahət xərclərinə qədər bir çox əməliyyat debet kartı ilə həm daha sürətli, həm də tam nəzarətli olur. Üstəlik, nağd pul daşımaq ehtiyacını aradan qaldıraraq vəsaitinizin təhlükəsizliyini daha etibarlı şəkildə təmin edir.",
      "Doğru kartı seçmək isə sadəcə cibinizdə bir ödəniş vasitəsi gəzdirmək deyil, eyni zamanda maliyyə vərdişlərinizi daha qazanclı hala gətirmək deməkdir. Seçim edərkən öz xərc vərdişlərinizi nəzərə alaraq; yüksək keşbek faizləri, komissiyasız nağdlaşdırma və köçürmə imkanları, həmçinin xüsusi partnyor endirimləri təklif edən kartlara üstünlük verməlisiniz.",
    ].join(nl),
  },
  {
    title: "Kimə hansı debet kart daha uyğundur?",
    desc: [
      "Kart seçimi həyat tərzindən asılıdır. Gündəlik alış-veriş edən, ödənişlərini əsasən telefon və kart üzərindən aparan istifadəçilər üçün keşbekli debet kart daha uyğun ola bilər. Rəqəmsal istifadəni üstün tutanlar üçün virtual kart formatı daha rahat seçimdir. Gənc auditoriya üçün nəzərdə tutulmuş kartlar isə daha sadə istifadə şərtləri və uyğun üstünlüklərlə seçilə bilər.",
      "Məsələn, klassik istifadə üçün sadə və funksional debet kart, tez-tez kampaniya və partnyor üstünlüklərindən yararlanmaq istəyənlər üçün isə əlavə bonuslar təqdim edən kart daha məqsədəuyğundur. Əsas məsələ kartı məhsul adı ilə deyil, istifadə ssenarinizə görə seçməkdir.",
    ].join(nl),
  },
  {
    title: "Debet kartınızı onlayn sifariş edin",
    desc: "Artıq kart seçərkən təkcə şərtlər yox, sifarişin rahatlığı da önəmlidir. Onlayn sifariş sizə vaxt qazandırır və banka getmək ehtiyacını aradan qaldırır. Kartınızı mobil tətbiqlə aktivləşdirmək, idarə etmək və xərclərinizi izləmək işinizi daha da asanlaşdırır. ABB-nin səhifəsində bütün kartları bir yerdə görə, müqayisə edə və ehtiyacınıza ən uyğununu anında onlayn sifariş edə bilərsiniz. Bu, həm yeni, həm də kartını yeniləyən müştərilər üçün ən rahat yoldur.",
  },
];

j["/ferdi/kartlar/debet-kartlari"].steps = [];
j["/ferdi/kartlar/debet-kartlari"].stepDetails = [];
j["/ferdi/kartlar/debet-kartlari"].stepsImage = null;

fs.writeFileSync(path, JSON.stringify(j, null, 2) + "\n");
const sample = j["/ferdi/kartlar/debet-kartlari"].contentSections[0].desc;
console.log("real newline:", sample.includes("\n\n"));
console.log("ok");
