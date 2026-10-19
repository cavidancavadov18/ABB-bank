export type MegaLink = {
  az: string;
  en: string;
  href: string;
  external?: boolean;
  bold?: boolean;
};

export type MegaColumn = {
  blocks: {
    title?: MegaLink;
    items?: MegaLink[];
  }[];
};

export type MegaMenuKey = "personal" | "business" | "about";

/** Real abb-bank.az mega-menu columns (left → right) */
export const megaMenus: Record<MegaMenuKey, MegaColumn[]> = {
  personal: [
    {
      blocks: [
        {
          title: {
            az: "Bütün kreditlər",
            en: "All loans",
            href: "/ferdi/kreditler",
            bold: true,
          },
          items: [
            { az: "Nağd kredit", en: "Cash loan", href: "/ferdi/kreditler/nagd-kredit" },
            { az: "Avans krediti", en: "Advance loan", href: "/ferdi/kreditler/avans-kredit-xetti" },
            { az: "İndi al, sonra ödə", en: "Buy now, pay later", href: "/ferdi/kreditler/indi-al-sonra-ode" },
            { az: "Avtomobil krediti", en: "Auto loan", href: "/ferdi/kreditler/avtomobil-krediti" },
            { az: "Əmanətçi nağd krediti", en: "Depositor cash loan", href: "/ferdi/kreditler/emanetci-nagd-krediti" },
            { az: "Əmanətçilər üçün kredit xətti", en: "Credit line for depositors", href: "/ferdi/kreditler/emanetci-kredit-limiti" },
          ],
        },
        {
          title: { az: "Kartlar", en: "Cards", href: "/ferdi/kartlar", bold: true },
          items: [
            { az: "Kredit kartları", en: "Credit cards", href: "/ferdi/kartlar/kredit-kartlari" },
            { az: "Debet kartları", en: "Debit cards", href: "/ferdi/kartlar/debet-kartlari" },
          ],
        },
        {
          title: { az: "Əmanətlər", en: "Deposits", href: "/ferdi/emanetler", bold: true },
          items: [
            { az: "DigiDeposit", en: "DigiDeposit", href: "/ferdi/emanetler/digideposit" },
            { az: "Klassik əmanət", en: "Classic deposit", href: "/ferdi/emanetler/klassik-emaneti" },
            { az: "Uşaq yığım əmanəti", en: "Child savings", href: "/ferdi/emanetler/usaq-yigim-emaneti" },
            { az: "Depozit seyfləri", en: "Safe deposit boxes", href: "/ferdi/emanetler/depozit-seyfi" },
            { az: "Əmanət əsaslı ipoteka krediti", en: "Deposit-based mortgage", href: "/ferdi/emanetler/emanetli-ipoteka-krediti" },
          ],
        },
      ],
    },
    {
      blocks: [
        {
          title: { az: "Hesablar", en: "Accounts", href: "/ferdi/butun-hesablar", bold: true },
          items: [
            { az: "DigiHesab Max", en: "DigiHesab Max", href: "/ferdi/butun-hesablar/digihesab-max" },
            { az: "DigiHesab", en: "DigiHesab", href: "/ferdi/butun-hesablar/digihesab" },
            { az: "Cari hesab", en: "Current account", href: "/ferdi/butun-hesablar/cari-hesab" },
            { az: "Dama-Dama", en: "Dama-Dama", href: "/ferdi/butun-hesablar/dama-dama" },
          ],
        },
        {
          title: {
            az: "İpoteka",
            en: "Mortgage",
            href: "/ferdi/kreditler/ipoteka-krediti",
            bold: true,
          },
        },
        {
          title: { az: "Keşbek", en: "Cashback", href: "/ferdi/kesbek", bold: true },
          items: [
            { az: "Faydalı keşbek", en: "Useful cashback", href: "/ferdi/kesbek/faydali-kesbek" },
            { az: "Fayda Max", en: "Fayda Max", href: "/ferdi/kesbek/fayda-max" },
            { az: "Faydalı Klub", en: "Faydalı Club", href: "/ferdi/kesbek/faydali-klub" },
          ],
        },
        {
          title: { az: "Kampaniyalar", en: "Campaigns", href: "/ferdi/kampaniyalar", bold: true },
        },
        {
          title: {
            az: "Bütün əməliyyatlar",
            en: "All operations",
            href: "/ferdi/butun-emeliyyatlar",
            bold: true,
          },
          items: [
            {
              az: "Ölkədaxili və ölkəxarici köçürmələr",
              en: "Domestic & international transfers",
              href: "/ferdi/butun-emeliyyatlar/olkedaxili-ve-olkexarici-kocurmeler",
            },
            {
              az: "Bank köçürmələri",
              en: "Bank transfers",
              href: "/ferdi/butun-emeliyyatlar/bank-kocurmeleri",
            },
          ],
        },
      ],
    },
    {
      blocks: [
        {
          title: { az: "Onlayn xidmətlər", en: "Online services", href: "/ferdi/randevu", bold: true },
          items: [
            { az: "Randevu", en: "Appointment", href: "/ferdi/randevu" },
            { az: "ABB mobile", en: "ABB mobile", href: "/abb-mobile" },
            { az: "Məlumat Mərkəzi", en: "Contact Center", href: "/ferdi/melumat-merkezi" },
            { az: "Arayış sifarişi", en: "Certificate order", href: "/ferdi/arayis-sifarisi" },
            { az: "Kredit ödənişi", en: "Loan payment", href: "/ferdi/kredit-odenisi" },
            { az: "Karta mədaxil", en: "Card top-up", href: "/ferdi/karta-medaxil" },
            { az: "Pul köçürməsi", en: "Money transfer", href: "/ferdi/pul-kocurmesi" },
            { az: "Cash by Code", en: "Cash by Code", href: "/ferdi/cash-by-code" },
            { az: "İanə et", en: "Donate", href: "/ferdi/iane-et" },
            { az: "PIN kod dəyişimi", en: "PIN change", href: "/ferdi/pin-kod-deyisimi" },
            { az: "Sığorta", en: "Insurance", href: "/ferdi/sigorta" },
            { az: "İnvestisiya", en: "Investment", href: "/ferdi/investisiya" },
            { az: "ABB-eSIM", en: "ABB-eSIM", href: "/abb-esim" },
            { az: "Ödənişlər", en: "Payments", href: "/ferdi/abb-mobile-odenisler" },
            { az: "DigiTravel", en: "DigiTravel", href: "/ferdi/digitravel" },
          ],
        },
        {
          title: {
            az: "ABB Prime",
            en: "ABB Prime",
            href: "https://prime.abb-bank.az/",
            bold: true,
            external: true,
          },
        },
      ],
    },
    {
      blocks: [
        {
          title: {
            az: "Tariflər, Sənədlər və Resurslar",
            en: "Tariffs, Documents & Resources",
            href: "/haqqimizda/senedler",
            bold: true,
          },
        },
        {
          title: {
            az: "Faydalı linklər",
            en: "Useful links",
            href: "/faydali-linkler",
            bold: true,
          },
        },
      ],
    },
  ],
  business: [
    {
      blocks: [
        {
          title: { az: "Korporativ", en: "Corporate", href: "/biznes/korporativ", bold: true },
        },
        {
          title: {
            az: "Kiçik və orta biznes",
            en: "SME",
            href: "/biznes/kicik-ve-orta-biznes",
            bold: true,
          },
        },
        {
          title: {
            az: "Mikro fərdi sahibkar",
            en: "Micro entrepreneur",
            href: "/biznes/mikro-biznes",
            bold: true,
          },
        },
        {
          title: {
            az: "İnternet Bankçılıq",
            en: "Internet Banking",
            href: "https://cb.abb-bank.az/",
            bold: true,
            external: true,
          },
        },
      ],
    },
    {
      blocks: [
        {
          title: {
            az: "Korporativ kreditlər",
            en: "Corporate loans",
            href: "/biznes/korporativ/korporativ-kreditler",
            bold: true,
          },
          items: [
            {
              az: "Korporativ kreditləşmə",
              en: "Corporate lending",
              href: "/biznes/korporativ/korporativ-kreditler/iri-korporativ-musterilerin-kreditlesdirilmesi",
            },
            {
              az: "İxraca dəstək krediti",
              en: "Export support loan",
              href: "/biznes/korporativ/korporativ-kreditler/ixraca-destek-krediti",
            },
          ],
        },
        {
          title: {
            az: "Kartlar",
            en: "Cards",
            href: "/biznes/korporativ/odenis-kartlari-1",
            bold: true,
          },
          items: [
            {
              az: "VISA Business Platinum",
              en: "VISA Business Platinum",
              href: "/biznes/korporativ/odenis-kartlari-1/visa-business-platinum-1",
            },
            {
              az: "Mastercard Corporate Travel & Expense",
              en: "Mastercard Corporate Travel & Expense",
              href: "/biznes/korporativ/odenis-kartlari-1/mastercard-corporate-travel-expense",
            },
            {
              az: "Mastercard Business",
              en: "Mastercard Business",
              href: "/biznes/korporativ/odenis-kartlari-1/mastercard-business-1",
            },
            {
              az: "VISA Business",
              en: "VISA Business",
              href: "/biznes/korporativ/odenis-kartlari-1/visa-business-1",
            },
            {
              az: "VISA Business Gold",
              en: "VISA Business Gold",
              href: "/biznes/korporativ/odenis-kartlari-1/visa-business-gold-1",
            },
            {
              az: "Gömrük Kartı",
              en: "Customs Card",
              href: "/biznes/korporativ/odenis-kartlari-1/gomruk-karti-1",
            },
            {
              az: "Əməkhaqqı Kartları",
              en: "Payroll cards",
              href: "/biznes/korporativ/odenis-kartlari-1/emekhaqqi-kartlari-1",
            },
          ],
        },
        {
          title: {
            az: "Hesablar",
            en: "Accounts",
            href: "/biznes/korporativ/hesablar-1",
            bold: true,
          },
        },
      ],
    },
    {
      blocks: [
        {
          title: {
            az: "Köçürmələr",
            en: "Transfers",
            href: "/biznes/korporativ/kocurmeler-1",
            bold: true,
          },
          items: [
            {
              az: "Pul köçürmələri",
              en: "Money transfers",
              href: "/biznes/korporativ/kocurmeler-1/pul-kocurmeleri-1",
            },
            {
              az: "Ani Ödəniş Sistemi",
              en: "Instant Payment System",
              href: "/biznes/korporativ/kocurmeler-1/ani-odenis-sistemi",
            },
          ],
        },
        {
          title: {
            az: "Sənədli əməliyyatlar",
            en: "Trade finance",
            href: "/biznes/korporativ/senedli-emeliyyatlar-1",
            bold: true,
          },
          items: [
            {
              az: "Bank qarantiyası",
              en: "Bank guarantee",
              href: "/biznes/korporativ/senedli-emeliyyatlar-1/qarantiya-1",
            },
            {
              az: "Qarantiya xətti",
              en: "Guarantee line",
              href: "/biznes/korporativ/senedli-emeliyyatlar-1/qarantiya-xetti-1",
            },
            {
              az: "Akkreditiv",
              en: "Letter of credit",
              href: "/biznes/korporativ/senedli-emeliyyatlar-1/akkreditiv-1",
            },
            {
              az: "İnkasso",
              en: "Collection",
              href: "/biznes/korporativ/senedli-emeliyyatlar-1/inkasso-1",
            },
            {
              az: "Layihələrin maliyyələşməsi",
              en: "Project finance",
              href: "/biznes/korporativ/senedli-emeliyyatlar-1/layihelerin-maliyyelesmesi-1",
            },
          ],
        },
        {
          title: {
            az: "İslam bankçılığı",
            en: "Islamic banking",
            href: "/biznes/kicik-ve-orta-biznes/islam-bankcilig",
            bold: true,
          },
        },
        {
          title: {
            az: "Tariflər, Sənədlər və Resurslar",
            en: "Tariffs, Documents & Resources",
            href: "/haqqimizda/senedler",
            bold: true,
          },
        },
      ],
    },
  ],
  about: [
    {
      blocks: [
        {
          title: { az: "Bank haqqında", en: "About the bank", href: "/haqqimizda", bold: true },
          items: [
            { az: "Rekvizitlər", en: "Details", href: "/haqqimizda/rekvizitler" },
            {
              az: "Missiya və strateji baxış",
              en: "Mission & strategy",
              href: "/haqqimizda/missiya-ve-strateji-baxis",
            },
            {
              az: "Sosial məsuliyyət / Sponsorluq",
              en: "CSR / Sponsorship",
              href: "/haqqimizda/korporativ-sosial-mesuliyyet",
            },
            { az: "Müxbir banklar", en: "Correspondent banks", href: "/haqqimizda/muxbir-banklar" },
            {
              az: "Törəmə və asılı müəssisələrdə iştirak payı",
              en: "Subsidiaries & affiliates",
              href: "/haqqimizda/istirak-payi",
            },
            { az: "Mükafatlar", en: "Awards", href: "/haqqimizda/mukafatlar" },
            {
              az: "Standart şərtlər",
              en: "Standard terms",
              href: "/standart-sertler-ve-melumatlandirma-formalari",
            },
          ],
        },
        {
          title: { az: "Rəhbərlik", en: "Leadership", href: "/haqqimizda/rehberlik", bold: true },
        },
        {
          title: {
            az: "İdarəetmə və Komitələr",
            en: "Governance & Committees",
            href: "/haqqimizda/idareetme-ve-komiteler",
            bold: true,
          },
        },
        {
          title: {
            az: "Tariflər, Sənədlər və Resurslar",
            en: "Tariffs, Documents & Resources",
            href: "/haqqimizda/senedler",
            bold: true,
          },
        },
        {
          title: {
            az: "Siyasətlərimiz",
            en: "Our policies",
            href: "/haqqimizda/siyasetlerimiz",
            bold: true,
          },
        },
        {
          title: {
            az: "Korporativ təqdimat",
            en: "Corporate presentation",
            href: "/korporativ-teqdimat",
            bold: true,
          },
        },
      ],
    },
    {
      blocks: [
        {
          title: { az: "Araşdırma", en: "Research", href: "/haqqimizda/arasdirma", bold: true },
        },
        {
          title: { az: "Hesabatlar", en: "Reports", href: "/haqqimizda/hesabatlar", bold: true },
        },
        {
          title: {
            az: "Hüquqi icmal",
            en: "Legal overview",
            href: "/haqqimizda/huquqi-icmal",
            bold: true,
          },
        },
        {
          title: {
            az: "Təklif və İradlar",
            en: "Feedback",
            href: "/haqqimizda/teklif-ve-iradlar",
            bold: true,
          },
        },
        {
          title: {
            az: "İnvestisiya bankçılığı",
            en: "Investment banking",
            href: "/haqqimizda/investisiya-bankciligi",
            bold: true,
          },
        },
        {
          title: {
            az: "Brend Mərkəzi",
            en: "Brand Center",
            href: "/haqqimizda/brend-merkezi",
            bold: true,
          },
        },
        {
          title: {
            az: "Satınalmalar",
            en: "Procurement",
            href: "/haqqimizda/satinalmalar/musabiqelerin-elani",
            bold: true,
          },
          items: [
            {
              az: "Müsabiqələrin elanı",
              en: "Tender announcements",
              href: "/haqqimizda/satinalmalar/musabiqelerin-elani",
            },
            {
              az: "Bildirişlər",
              en: "Notices",
              href: "/haqqimizda/satinalmalar/bildirisler",
            },
            {
              az: "Bağlanmış müqavilələrin qeydiyyatı",
              en: "Contract registry",
              href: "/haqqimizda/satinalmalar/baglanmis-muqavilelerin-reyestri",
            },
            {
              az: "Satınalma planı",
              en: "Procurement plan",
              href: "/haqqimizda/satinalmalar/satinalma-plani",
            },
            {
              az: "Təchizatçı sorğusu",
              en: "Supplier questionnaire",
              href: "/haqqimizda/satinalmalar/techizatci-anketi",
            },
            {
              az: "Satınalma hesabatları",
              en: "Procurement reports",
              href: "/haqqimizda/hesabatlar",
            },
          ],
        },
      ],
    },
  ],
};

export function flattenMegaLinks(key: MegaMenuKey): MegaLink[] {
  const out: MegaLink[] = [];
  for (const col of megaMenus[key]) {
    for (const block of col.blocks) {
      if (block.title) out.push(block.title);
      if (block.items) out.push(...block.items);
    }
  }
  return out;
}
