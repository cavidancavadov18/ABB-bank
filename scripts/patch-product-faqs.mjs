/**
 * Curated high-quality FAQs for key product pages that lack them
 * (real site often has no FAQ accordion on those URLs).
 */
import fs from "fs";

const pages = JSON.parse(
  fs.readFileSync("src/lib/data/sectionPages.json", "utf8")
);

/** @type {Record<string, {q:string;a:string}[]>} */
const FAQ = {
  "/ferdi/emanetler/digideposit": [
    {
      q: "DigiDeposit nədir?",
      a: "DigiDeposit ABB mobile vasitəsilə onlayn açılan rəqəmsal əmanətdir. Filiala gəlmədən əmanət hesabı aça və faiz gəliri əldə edə bilərsiniz.",
    },
    {
      q: "Minimum məbləğ nə qədərdir?",
      a: "Minimum məbləğ və faiz dərəcələri seçdiyiniz valyuta və müddətdən asılıdır. Aktuell şərtlər ABB mobile-da və əmanət səhifəsində göstərilir.",
    },
    {
      q: "Vaxtından əvvəl çıxarış mümkündürmü?",
      a: "Şərtlər məhsul növündən asılıdır. Bəzi DigiDeposit variantlarında erkən çıxarış mümkün ola bilər; faiz hesablanması şərtlərə uyğun dəyişə bilər.",
    },
  ],
  "/ferdi/emanetler/klassik-emaneti": [
    {
      q: "Klassik əmanət necə açılır?",
      a: "Klassik əmanəti filialda və ya uyğun onlayn kanallar vasitəsilə aça bilərsiniz. Şəxsiyyət vəsiqəsi tələb olunur.",
    },
    {
      q: "Faizlər necə ödənilir?",
      a: "Faizlər seçilmiş müddət və şərtlərə uyğun olaraq aylıq, rüblük və ya müddət sonunda hesablanıb ödənilə bilər.",
    },
    {
      q: "Əmanət sığortalanırmı?",
      a: "Qanunvericiliyə uyğun olaraq əmanətlər Əmanətlərin Sığortalanması Fondu (ADIF) çərçivəsində sığortalanır.",
    },
  ],
  "/ferdi/emanetler/usaq-yigim-emaneti": [
    {
      q: "Uşaq yığım əmanətini kim aça bilər?",
      a: "Əmanəti uşağın qanuni nümayəndəsi (valideyn və ya qəyyum) aça bilər. Vəsait uşağın gələcək ehtiyacları üçün nəzərdə tutulur.",
    },
    {
      q: "Faiz dərəcəsi nə qədərdir?",
      a: "AZN üzrə illik 8.5%-dək, USD üzrə isə 2.5%-dək faiz gəliri təklif olunur. Müddət adətən 36 aydır.",
    },
    {
      q: "Əmanəti artıra bilərəmmi?",
      a: "Bəli, yığımı müddət ərzində artırmaq mümkündür. Faiz kapitalizasiyası şərtlərə uyğun tətbiq olunur.",
    },
  ],
  "/ferdi/emanetler/depozit-seyfi": [
    {
      q: "Depozit seyfi nə üçün lazımdır?",
      a: "Depozit seyfləri qiymətli əşya, sənəd və digər əmlakın təhlükəsiz saxlanması üçündür. Seyflər filiallarda icarəyə verilir.",
    },
    {
      q: "İcarə haqqı necə müəyyən olunur?",
      a: "İcarə haqqı seyfin ölçüsündən və müddətdən asılıdır. Tariflər filialda və rəsmi sənədlərdə göstərilir.",
    },
  ],
  "/ferdi/kreditler/avtomobil-krediti": [
    {
      q: "Avtomobil krediti üçün şərtlər nələrdir?",
      a: "Rəsmi dilerlərdən avtomobil almaq üçün kredit təklif olunur. Yaş, iş stajı və gəlir tələbləri tətbiq oluna bilər.",
    },
    {
      q: "İlkin ödəniş tələb olunurmu?",
      a: "İlkin ödəniş diler və kampaniya şərtlərinə görə dəyişə bilər. Ətraflı məlumat üçün müraciət zamanı bildirilir.",
    },
    {
      q: "Müraciəti harada edə bilərəm?",
      a: "Filialda, diler nöqtələrində və ya ABB-nin onlayn kanalları vasitəsilə müraciət edə bilərsiniz.",
    },
  ],
  "/ferdi/kreditler/avans-kredit-xetti": [
    {
      q: "Avans kredit xətti nədir?",
      a: "Avans kredit xətti kart və ya hesab üzrə müəyyən edilmiş limit çərçivəsində vəsaitdən istifadə imkanı verir.",
    },
    {
      q: "Limit necə təyin olunur?",
      a: "Limit gəlir, kredit tarixçəsi və bankın daxili qiymətləndirməsi əsasında fərdi müəyyən edilir.",
    },
  ],
  "/ferdi/kreditler/emanetci-nagd-krediti": [
    {
      q: "Əmanətçi nağd krediti kimlər üçündür?",
      a: "ABB-də əmanəti olan müştərilər üçün nəzərdə tutulub. Əmanət girov kimi çıxış edə bilər.",
    },
    {
      q: "Faiz dərəcəsi necədir?",
      a: "Faiz dərəcəsi əmanət və kredit şərtlərinə görə dəyişir. Aktuell FİFD diapazonu məhsul səhifəsində göstərilir.",
    },
  ],
  "/ferdi/kreditler/emanetci-kredit-limiti": [
    {
      q: "Əmanətçi kredit limiti nədir?",
      a: "Əmanətiniz əsasında açıla bilən kredit xəttidir. Limit əmanət məbləği və şərtlərə uyğun müəyyən olunur.",
    },
    {
      q: "Əmanətimi bağlamaq lazımdırmı?",
      a: "Adətən əmanət girovda qalır və müddət bitənədək saxlanılır. Dəqiq şərtlər müqavilədə göstərilir.",
    },
  ],
  "/ferdi/butun-hesablar/digihesab-max": [
    {
      q: "DigiHesab Max-ın üstünlüyü nədir?",
      a: "Hesab qalığına faiz gəliri əldə edirsiniz və hesabı ABB mobile-da tam rəqəmsal idarə edə bilərsiniz.",
    },
    {
      q: "Hesabı necə aça bilərəm?",
      a: "ABB mobile-da SİMA imza ilə onlayn açmaq mümkündür. Filiala gəlməyə ehtiyac yoxdur.",
    },
  ],
  "/ferdi/butun-hesablar/digihesab": [
    {
      q: "DigiHesab nədir?",
      a: "Tam rəqəmsal cari hesabdır. Onlayn açılır və gündəlik köçürmə, ödəniş əməliyyatları üçün əlverişlidir.",
    },
    {
      q: "Kart əlavə oluna bilərmi?",
      a: "Bəli, hesabınıza uyğun debet kart əlavə edə və ABB mobile-da idarə edə bilərsiniz.",
    },
  ],
  "/ferdi/butun-hesablar/cari-hesab": [
    {
      q: "Cari hesab hansı valyutalarda açılır?",
      a: "AZN və digər məşhur valyutalarda cari hesab aça bilərsiniz. Şərtlər filial və onlayn kanallarda dəqiqləşdirilir.",
    },
    {
      q: "Hesabın idarə edilməsi necədir?",
      a: "ABB mobile, internet bankçılıq və filial vasitəsilə hesabınızı idarə edə bilərsiniz.",
    },
  ],
  "/ferdi/kesbek/faydali-kesbek": [
    {
      q: "Faydalı keşbek necə işləyir?",
      a: "Seçilmiş kateqoriyalarda və partnyorlarda kartla ödəniş etdikdə keşbek qazanırsınız. Məbləğ şərtlərə uyğun hesaba qaytarılır.",
    },
    {
      q: "Keşbek limiti varmı?",
      a: "Kateqoriya və kampaniyadan asılı olaraq aylıq limitlər tətbiq oluna bilər. Detallar ABB mobile-da görünür.",
    },
  ],
  "/ferdi/cash-by-code": [
    {
      q: "Cash by Code nədir?",
      a: "Kart olmadan xüsusi kodla ATM-dən nağd çıxarış etməyə imkan verən xidmətdir.",
    },
    {
      q: "Kod nə qədər müddətə keçərlidir?",
      a: "Kodun etibarlılıq müddəti xidmət şərtlərinə uyğundur və yaradılma zamanı göstərilir.",
    },
  ],
  "/ferdi/pul-kocurmesi": [
    {
      q: "Pul köçürməsini harada edə bilərəm?",
      a: "ABB mobile, internet bankçılıq, filial və digər rəsmi kanallar vasitəsilə köçürmə edə bilərsiniz.",
    },
    {
      q: "Ölkəxarici köçürmə mümkündürmü?",
      a: "Bəli, beynəlxalq köçürmə xidmətləri mövcuddur. Tarif və müddətlər istiqamətdən asılıdır.",
    },
  ],
  "/ferdi/kampaniyalar": [
    {
      q: "Kampaniyalardan necə yararlanım?",
      a: "Aktiv kampaniyalar bu səhifədə və ABB mobile-da göstərilir. Hər kampaniyanın öz iştirak şərtləri var.",
    },
    {
      q: "Kampaniya müddəti bitəndə nə olur?",
      a: "Müddət bitdikdən sonra yeni müraciətlər qəbul olunmur. Artıq aktivləşmiş hüquqlar şərtlərə uyğun saxlanılır.",
    },
  ],
  "/biznes/mikro-biznes": [
    {
      q: "Mikro biznes kreditinə kimlər müraciət edə bilər?",
      a: "Fərdi sahibkarlar və kiçik biznes subyektləri VÖEN və digər tələb olunan sənədlərlə müraciət edə bilər.",
    },
    {
      q: "Onlayn kredit mümkündürmü?",
      a: "Bəli, müəyyən məbləğədək tam onlayn kredit imkanı mövcuddur. Şərtlər qiymətləndirmədən asılıdır.",
    },
  ],
  "/abb-mobile": [
    {
      q: "ABB mobile-ı haradan yükləyə bilərəm?",
      a: "App Store və Google Play-dən rəsmi ABB mobile tətbiqini yükləyə bilərsiniz. Saytdakı QR kod da kömək edir.",
    },
    {
      q: "Tətbiqdə hansı əməliyyatlar var?",
      a: "Köçürmə, ödəniş, kart sifarişi, əmanət, kredit müraciəti, keşbek və digər rəqəmsal xidmətlər mövcuddur.",
    },
  ],
};

let n = 0;
for (const [route, faqs] of Object.entries(FAQ)) {
  const page = pages[route];
  if (!page) continue;
  const existing = (page.faqs || []).filter(
    (f) => typeof f === "object" && (f.a || "").length > 40
  );
  if (existing.length >= 2) continue;
  page.faqs = faqs;
  page.ok = true;
  n++;
}

fs.writeFileSync(
  "src/lib/data/sectionPages.json",
  JSON.stringify(pages, null, 2),
  "utf8"
);
console.log("Patched FAQ on", n, "product pages");
