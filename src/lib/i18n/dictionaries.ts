import type { Locale } from "./types";

type DeepString<T> = T extends string
  ? string
  : T extends ReadonlyArray<infer U>
    ? DeepString<U>[]
    : T extends object
      ? { [K in keyof T]: DeepString<T[K]> }
      : T;

const az = {
  meta: {
    title: "ABB | Müasir bankçılıq həlləri və onlayn bank xidmətləri",
    description:
      "ABB — müasir bankçılıq həlləri, kartlar, kreditlər, əmanətlər və onlayn xidmətlər.",
    demoNote: "Demo klon — rəsmi sayt deyil",
  },
  nav: {
    personal: "Fərdi",
    business: "Biznes",
    about: "Haqqımızda",
    investors: "İnvestorlarla əlaqə",
    news: "Xəbərlər",
    network: "Xidmət şəbəkəsi",
    search: "Axtarış",
    phone: "937",
    themeLight: "Gündüz rejimi",
    themeDark: "Gecə rejimi",
  },
  megaPersonal: {
    credits: "Bütün kreditlər",
    cards: "Kartlar",
    deposits: "Əmanətlər",
    accounts: "Hesablar",
    mortgage: "İpoteka",
    cashback: "Keşbek",
    campaigns: "Kampaniyalar",
    operations: "Bütün əməliyyatlar",
    online: "Onlayn xidmətlər",
    prime: "ABB Prime",
    tariffs: "Tariflər, Sənədlər və Resurslar",
    useful: "Faydalı linklər",
  },
  megaBusiness: {
    corporate: "Korporativ",
    sme: "Kiçik və orta biznes",
    micro: "Mikro fərdi sahibkar",
    internet: "İnternet Bankçılıq",
  },
  megaAbout: {
    bank: "Bank haqqında",
    leadership: "Rəhbərlik",
    governance: "İdarəetmə və Komitələr",
    tariffs: "Tariflər, Sənədlər və Resurslar",
    policies: "Siyasətlərimiz",
    presentation: "Korporativ təqdimat",
    research: "Araşdırma",
    reports: "Hesabatlar",
    legal: "Hüquqi icmal",
    feedback: "Təklif və İradlar",
    investment: "İnvestisiya bankçılığı",
    brand: "Brend Mərkəzi",
    procurement: "Satınalmalar",
  },
  home: {
    digiDepositTitle: "DigiDeposit",
    digiDepositDesc: "ABB mobile tətbiqindən əmanət hesabınızı onlayn açın",
    abbBizTitle: "ABB Biz",
    abbBizDesc: "Kiçik bizneslər üçün xidmətlər. Mobil tətbiqi yükləyin",
    cashLoanTitle: "Nağd kredit",
    cashLoanDesc: "Təcili pul ehtiyacınız üçün sərfəli kredit müraciəti edin",
    mobileTitle: "ABB mobile",
    mobileDesc: "Bank əməliyyatlarını sadə və sürətli şəkildə tamamlayın",
    latestNews: "Ən aktual xəbərlər",
    allNews: "Bütün xəbərlər",
    quickLinks: "Sürətli keçidlər",
    mortgage: "İpoteka krediti",
    debitCards: "Debet kartlar",
    creditCards: "Kredit kartları",
    cashback: "Keşbek",
    branches: "Filiallar və ATM-lər",
    investment: "İnvestisiya",
    digiCardTitle: "Tam DigiCard",
    digiCardDesc: "Tam rəqəmsal, Tam real!",
    free: "Pulsuz",
    cashbackUpTo: "10%-ə qədər",
    incomeNote: "*İllik 6% gəlir",
    digiCardNote:
      "*ABB mobile-da qeydiyyatdan keçmiş və kartını əlavə etmiş müştərilərə aiddir",
    order: "Sifariş edin",
    usefulCashback: "Faydalı keşbek",
    creditLimitTitle: "Kredit limitinizi öyrənin",
    creditLimitDesc: "70 000 AZN-dək krediti tam onlayn əldə edin!",
    mobileNumber: "Mobil nömrə",
    finCode: "FİN kod",
    consent:
      "“Davam et” düyməsinə klikləməklə Azərbaycan Kredit Bürosu və ASAN Finans vasitəsilə məlumatlarımın ABB-yə təqdim edilməsinə razılıq verirəm.",
    continue: "Davam et",
    joinUs: "Bizə qatılın",
    futureWithAbb: "Gələcəyinizi ABB ilə qurun!",
    campaigns: "Kampaniyalar",
    calculateNow: "İndi hesablayın",
    initialCalc: "İlkin hesablama",
    credit: "Kredit",
    deposit: "Depozit",
    autoLoan: "Avtomobil krediti",
    mortgageTab: "İpoteka",
    amount: "Məbləğ",
    term: "Müddət (ay)",
    rate: "Faiz dərəcəsi (%)",
    monthlyPayment: "Aylıq ödəniş",
    totalPayment: "Ümumi ödəniş",
    currencyRates: "Valyuta məzənnələri",
    allRates: "Bütün valyuta məzənnələri",
    currency: "Valyuta",
    buy: "Alış",
    sell: "Satış",
    converter: "Valyuta konvertoru",
    services: "Xidmətlərimiz",
    atms: "ATM-lər və Filiallar",
    onlineQueue: "Onlayn növbə",
    callCenter: "Məlumat mərkəzi 24/7",
    statement: "Hesabdan çıxarış sifariş et",
    loanPay: "Kredit ödənişi",
    donate: "İanə et",
    allServices: "Bütün xidmətlər",
    mobileAppTitle: "ABB mobile",
    mobileAppDesc: "4.9 reytinqə malik innovativ və təhlükəsiz bank mobil tətbiqi!",
    qrHint: "ABB mobile yükləmək üçün QR kodu skan edin.",
    careTitle: "Maliyyə məsələlərinizə qayğı göstəririk",
    care1Title: "Pulun effektiv idarə edilməsi",
    care1Desc: "Gələcəyinizi etibarlı təhlükəsizlik həllərimizlə qoruyun.",
    care2Title: "Gələcək üçün planlar",
    care2Desc:
      "Gələcək planlarınız və ehtiyaclarınız üçün sizə uyğun maliyyə dəstəyi alın.",
    care3Title: "Maliyyə təhlükəsizliyi",
    care3Desc: "Pulunuzu dələduzlardan qorumaq üçün bu tövsiyələrə əməl edin.",
    more: "Daha çox",
    ratePage: "Səhifəni dəyərləndirin",
    rateDesc: "Fikirlərinizi bizimlə bölüşün. Rəyləriniz dəyərlidir!",
    detailed: "Ətraflı",
    apply: "Müraciət edin",
    orderNow: "İndi sifariş edin",
    onlineOrder: "Onlayn sifariş edin",
  },
  personalPage: {
    title: "Fərdi bankçılıq",
    subtitle:
      "Kartlar, kreditlər, əmanətlər və onlayn xidmətlər — gündəlik maliyyəniz üçün tam həllər.",
    productsTitle: "Məhsul və xidmətlər",
    products: [
      {
        title: "Nağd kredit",
        desc: "70 000 AZN-dək nağd krediti filiala gəlmədən əldə edin. Faiz dərəcəsi 10.9%-dən.",
        cta: "Müraciət edin",
      },
      {
        title: "Debet və kredit kartları",
        desc: "Tam DigiCard, TamKart Max, Travel Card və digər kartlarla keşbek və üstünlüklər.",
        cta: "Kart seçin",
      },
      {
        title: "Əmanətlər",
        desc: "DigiDeposit və Uşaq yığım əmanəti ilə yığımlarınızı artırın.",
        cta: "Ətraflı",
      },
      {
        title: "İpoteka",
        desc: "Mənzil almaq üçün sərfəli ipoteka şərtləri və ilkin ödəniş imkanları.",
        cta: "Hesablayın",
      },
      {
        title: "Keşbek",
        desc: "Partnyor mağazalarda alış-veriş edərək 10%-ə qədər keşbek qazanın.",
        cta: "Keşbekə baxın",
      },
      {
        title: "ABB Prime",
        desc: "Premium müştərilər üçün fərdi menecer, yüksək limitlər və eksklüziv imtiyazlar.",
        cta: "Ətraflı",
      },
    ],
  },
  businessPage: {
    title: "Biznes bankçılığı",
    subtitle:
      "Korporativ, KOB və mikro sahibkarlar üçün kredit, hesab və rəqəmsal həllər.",
    segments: [
      {
        title: "Korporativ",
        desc: "İri müəssisələr üçün hesablaşma, maliyyələşmə və trade finance xidmətləri.",
      },
      {
        title: "Kiçik və orta biznes",
        desc: "ABB Biz ilə hesab açın, ödənişləri idarə edin və biznes kreditinə müraciət edin.",
      },
      {
        title: "Mikro fərdi sahibkar",
        desc: "VÖEN ilə 100 000 AZN-dək tam onlayn kredit və sürətli hesab açılışı.",
      },
      {
        title: "İnternet Bankçılıq",
        desc: "Korporativ internet bankçılıq ilə əməliyyatları 24/7 idarə edin.",
      },
    ],
  },
  aboutPage: {
    title: "ABB - İlin bankı",
    subtitle: "Məqsədimiz müasir maliyyə dünyasında etibarlı tərəfdaşınız olmaqdır",
    awardsTitle: "Əsas mükafatlar",
    awardsDesc:
      "ABB müştəri yönümlülüyü və maliyyə innovasiyaları sahəsindəki uğurlarına görə bir sıra beynəlxalq mükafatlarla təltif edilib.",
    stats: [
      { value: "100+", label: "Filial və xidmət nöqtəsi" },
      { value: "1000+", label: "ATM şəbəkəsi" },
      { value: "2M+", label: "Aktiv müştəri" },
      { value: "4.9", label: "Mobil tətbiq reytinqi" },
    ],
    sections: [
      {
        title: "Bank haqqında",
        desc: "ABB Azərbaycanın aparıcı banklarından biridir. Rəqəmsal innovasiya və müştəri təcrübəsi prioritetimizdir.",
      },
      {
        title: "Rəhbərlik",
        desc: "İdarə Heyəti və Direktorlar Şurası bankın strateji inkişafını yönləndirir.",
      },
      {
        title: "Siyasətlərimiz",
        desc: "ESG, məlumat təhlükəsizliyi, AML və müştəri hüquqlarının qorunması siyasətləri.",
      },
      {
        title: "Hesabatlar",
        desc: "Maliyyə hesabatları, illik hesabatlar və şəffaflıq sənədləri.",
      },
    ],
  },
  newsPage: {
    title: "Xəbərlər",
    subtitle: "ABB-dən ən son xəbərlər, kampaniyalar və elanlar",
    readMore: "Oxu",
  },
  investorsPage: {
    title: "İnvestorlarla əlaqə",
    subtitle:
      "Maliyyə nəticələri, korporativ idarəetmə və investor məlumatları.",
    cards: [
      {
        title: "Maliyyə hesabatları",
        desc: "Rüblük və illik maliyyə nəticələri, auditor rəyləri.",
      },
      {
        title: "Korporativ idarəetmə",
        desc: "İdarəetmə strukturu, komitələr və siyasət sənədləri.",
      },
      {
        title: "Səhm və dividend",
        desc: "Səhm məlumatları, dividend siyasəti və elanlar.",
      },
      {
        title: "Təqdimatlar",
        desc: "İnvestor təqdimatları və strateji baxış materialları.",
      },
      {
        title: "Əlaqə",
        desc: "İnvestor əlaqələri komandası: ir@abb-bank.az",
      },
      {
        title: "Reytinqlər",
        desc: "Beynəlxalq reytinq agentliklərinin qiymətləndirmələri.",
      },
    ],
  },
  footer: {
    personal: "Fərdi",
    business: "Biznes",
    about: "Haqqımızda",
    download: "ABB mobile yüklə",
    career: "ABB Karyera",
    careerCta: "Karyera portalı",
    careerDesc: "Uğur hekayənizi ABB ilə yazın",
    careerBannerDesc:
      "Maraqlı fürsətləri araşdırın, karyeranızı inkişaf etdirin və təsir göstərin. Bu gün ABB Karyera Platformasında yenilikçi komandamıza qoşulun!",
    address: "Ünvan: 67, Nizami küç., AZ1005 Bakı, Azərbaycan",
    rights: "© ABB 2026 - Bütün hüquqlar qorunur",
    tel: "Tel: +994 12 493 00 91",
    email: "E-poçt: info@abb-bank.az",
    fax: "Faks: +994 12 493 00 91",
  },
  search: {
    title: "Axtarış",
    placeholder: "Məhsul, xidmət və ya səhifə axtarın...",
    noResults: "Nəticə tapılmadı",
    close: "Bağla",
  },
  chat: {
    open: "Chat aç",
    close: "Chatı bağla",
    minimize: "Kiçilt",
    greeting: "Salam 👋",
    welcome: "ABB-yə xoş gəlmisiniz!",
    askTitle: "Sual verin",
    askHint: "24/7 xidmətinizdəyik",
    placeholder: "Mesajınızı yazın...",
    send: "Göndər",
    typing: "ABB yazır…",
    suggestions: ["Kartlar", "Nağd kredit", "Filiallar", "937"],
    botReplyDefault:
      "Suallarınızı buradan yaza bilərsiniz. Kartlar, kreditlər, əmanətlər və ya filiallar haqqında soruşun. Əlavə dəstək üçün 937 qısa nömrəsinə zəng edin.",
    botReplyCards:
      "Debet və kredit kartlarını onlayn sifariş edə bilərsiniz: Fərdi → Kartlar. Ətraflı məlumat üçün Kartlar səhifəsinə keçin.",
    botReplyLoan:
      "Nağd kreditə ABB mobile və ya sayt vasitəsilə müraciət edə bilərsiniz. Fərdi → Kreditlər → Nağd kredit bölməsinə baxın.",
    botReplyBranch:
      "Filial və ATM xəritəsi üçün «Xidmət şəbəkəsi» düyməsinə basın və ya /filiallar səhifəsinə keçin.",
    botReplyPhone:
      "24/7 Məlumat mərkəzi: 937. Digər əlaqə: +994 12 493 00 91 · info@abb-bank.az",
    botReplyDeposit:
      "Əmanətlər və DigiDeposit haqqında məlumat Fərdi → Əmanətlər bölməsindədir. Onlayn açılış ABB mobile-da mümkündür.",
  },
  form: {
    success: "Müraciətiniz qəbul olundu (demo).",
    invalidPhone: "Düzgün mobil nömrə daxil edin",
    invalidFin: "FİN kod 7 simvol olmalıdır",
  },
};

const en: DeepString<typeof az> = {
  meta: {
    title: "ABB | Modern banking solutions and online services",
    description:
      "ABB — modern banking solutions, cards, loans, deposits and online services.",
    demoNote: "Demo clone — not the official site",
  },
  nav: {
    personal: "Personal",
    business: "Business",
    about: "About us",
    investors: "Investor relations",
    news: "News",
    network: "Service network",
    search: "Search",
    phone: "937",
    themeLight: "Light mode",
    themeDark: "Dark mode",
  },
  megaPersonal: {
    credits: "All loans",
    cards: "Cards",
    deposits: "Deposits",
    accounts: "Accounts",
    mortgage: "Mortgage",
    cashback: "Cashback",
    campaigns: "Campaigns",
    operations: "All operations",
    online: "Online services",
    prime: "ABB Prime",
    tariffs: "Tariffs, Documents & Resources",
    useful: "Useful links",
  },
  megaBusiness: {
    corporate: "Corporate",
    sme: "Small & medium business",
    micro: "Micro entrepreneur",
    internet: "Internet Banking",
  },
  megaAbout: {
    bank: "About the bank",
    leadership: "Leadership",
    governance: "Governance & Committees",
    tariffs: "Tariffs, Documents & Resources",
    policies: "Our policies",
    presentation: "Corporate presentation",
    research: "Research",
    reports: "Reports",
    legal: "Legal overview",
    feedback: "Feedback",
    investment: "Investment banking",
    brand: "Brand Center",
    procurement: "Procurement",
  },
  home: {
    digiDepositTitle: "DigiDeposit",
    digiDepositDesc: "Open your deposit account online via ABB mobile",
    abbBizTitle: "ABB Biz",
    abbBizDesc: "Services for small businesses. Download the mobile app",
    cashLoanTitle: "Cash loan",
    cashLoanDesc: "Apply for a favorable loan for urgent cash needs",
    mobileTitle: "ABB mobile",
    mobileDesc: "Complete banking operations simply and quickly",
    latestNews: "Latest news",
    allNews: "All news",
    quickLinks: "Quick links",
    mortgage: "Mortgage loan",
    debitCards: "Debit cards",
    creditCards: "Credit cards",
    cashback: "Cashback",
    branches: "Branches & ATMs",
    investment: "Investment",
    digiCardTitle: "Tam DigiCard",
    digiCardDesc: "Fully digital, Fully real!",
    free: "Free",
    cashbackUpTo: "Up to 10%",
    incomeNote: "*6% annual income",
    digiCardNote:
      "*Applies to customers registered in ABB mobile with an added card",
    order: "Order now",
    usefulCashback: "Useful cashback",
    creditLimitTitle: "Check your credit limit",
    creditLimitDesc: "Get up to 70,000 AZN fully online!",
    mobileNumber: "Mobile number",
    finCode: "FIN code",
    consent:
      "By clicking “Continue” I consent to ABB receiving my data via Azerbaijan Credit Bureau and ASAN Finans.",
    continue: "Continue",
    joinUs: "Join us",
    futureWithAbb: "Build your future with ABB!",
    campaigns: "Campaigns",
    calculateNow: "Calculate now",
    initialCalc: "Initial calculation",
    credit: "Loan",
    deposit: "Deposit",
    autoLoan: "Auto loan",
    mortgageTab: "Mortgage",
    amount: "Amount",
    term: "Term (months)",
    rate: "Interest rate (%)",
    monthlyPayment: "Monthly payment",
    totalPayment: "Total payment",
    currencyRates: "Exchange rates",
    allRates: "All exchange rates",
    currency: "Currency",
    buy: "Buy",
    sell: "Sell",
    converter: "Currency converter",
    services: "Our services",
    atms: "ATMs & Branches",
    onlineQueue: "Online queue",
    callCenter: "Contact center 24/7",
    statement: "Order account statement",
    loanPay: "Loan payment",
    donate: "Donate",
    allServices: "All services",
    mobileAppTitle: "ABB mobile",
    mobileAppDesc: "Innovative and secure banking app with 4.9 rating!",
    qrHint: "Scan the QR code to download ABB mobile.",
    careTitle: "We care about your finances",
    care1Title: "Effective money management",
    care1Desc: "Protect your future with reliable security solutions.",
    care2Title: "Plans for the future",
    care2Desc: "Get financial support tailored to your future plans and needs.",
    care3Title: "Financial security",
    care3Desc: "Follow these tips to protect your money from fraud.",
    more: "Learn more",
    ratePage: "Rate this page",
    rateDesc: "Share your thoughts with us. Your feedback matters!",
    detailed: "Details",
    apply: "Apply",
    orderNow: "Order now",
    onlineOrder: "Order online",
  },
  personalPage: {
    title: "Personal banking",
    subtitle:
      "Cards, loans, deposits and online services — complete solutions for everyday finance.",
    productsTitle: "Products & services",
    products: [
      {
        title: "Cash loan",
        desc: "Get up to 70,000 AZN without visiting a branch. Rates from 10.9%.",
        cta: "Apply",
      },
      {
        title: "Debit & credit cards",
        desc: "Tam DigiCard, TamKart Max, Travel Card and more with cashback benefits.",
        cta: "Choose a card",
      },
      {
        title: "Deposits",
        desc: "Grow your savings with DigiDeposit and Child savings deposit.",
        cta: "Details",
      },
      {
        title: "Mortgage",
        desc: "Favorable mortgage terms and down payment options for your home.",
        cta: "Calculate",
      },
      {
        title: "Cashback",
        desc: "Earn up to 10% cashback at partner stores.",
        cta: "View cashback",
      },
      {
        title: "ABB Prime",
        desc: "Personal manager, higher limits and exclusive privileges.",
        cta: "Details",
      },
    ],
  },
  businessPage: {
    title: "Business banking",
    subtitle:
      "Credit, accounts and digital solutions for corporate, SME and micro entrepreneurs.",
    segments: [
      {
        title: "Corporate",
        desc: "Settlement, financing and trade finance for large enterprises.",
      },
      {
        title: "Small & medium business",
        desc: "Open an account with ABB Biz, manage payments and apply for business loans.",
      },
      {
        title: "Micro entrepreneur",
        desc: "Fully online loans up to 100,000 AZN with TIN and fast account opening.",
      },
      {
        title: "Internet Banking",
        desc: "Manage corporate operations 24/7 with internet banking.",
      },
    ],
  },
  aboutPage: {
    title: "ABB - Bank of the Year",
    subtitle: "Our goal is to be your trusted partner in modern finance",
    awardsTitle: "Key awards",
    awardsDesc:
      "ABB has received international awards for customer focus and financial innovation.",
    stats: [
      { value: "100+", label: "Branches & service points" },
      { value: "1000+", label: "ATM network" },
      { value: "2M+", label: "Active customers" },
      { value: "4.9", label: "Mobile app rating" },
    ],
    sections: [
      {
        title: "About the bank",
        desc: "ABB is one of Azerbaijan’s leading banks. Digital innovation and customer experience are our priorities.",
      },
      {
        title: "Leadership",
        desc: "The Management Board and Board of Directors guide the bank’s strategic development.",
      },
      {
        title: "Our policies",
        desc: "ESG, data security, AML and customer rights protection policies.",
      },
      {
        title: "Reports",
        desc: "Financial statements, annual reports and transparency documents.",
      },
    ],
  },
  newsPage: {
    title: "News",
    subtitle: "Latest news, campaigns and announcements from ABB",
    readMore: "Read",
  },
  investorsPage: {
    title: "Investor relations",
    subtitle: "Financial results, corporate governance and investor information.",
    cards: [
      {
        title: "Financial reports",
        desc: "Quarterly and annual results, auditor opinions.",
      },
      {
        title: "Corporate governance",
        desc: "Governance structure, committees and policy documents.",
      },
      {
        title: "Shares & dividends",
        desc: "Share information, dividend policy and announcements.",
      },
      {
        title: "Presentations",
        desc: "Investor presentations and strategic outlook materials.",
      },
      {
        title: "Contact",
        desc: "Investor relations team: ir@abb-bank.az",
      },
      {
        title: "Ratings",
        desc: "Assessments by international rating agencies.",
      },
    ],
  },
  footer: {
    personal: "Personal",
    business: "Business",
    about: "About us",
    download: "Download ABB mobile",
    career: "ABB Career",
    careerCta: "Career portal",
    careerDesc: "Write your success story with ABB",
    careerBannerDesc:
      "Explore interesting opportunities, grow your career and make an impact. Join our innovative team on the ABB Career Platform today!",
    address: "Address: 67, Nizami str., AZ1005 Baku, Azerbaijan",
    rights: "© ABB 2026 - All rights reserved",
    tel: "Tel: +994 12 493 00 91",
    email: "Email: info@abb-bank.az",
    fax: "Fax: +994 12 493 00 91",
  },
  search: {
    title: "Search",
    placeholder: "Search products, services or pages...",
    noResults: "No results found",
    close: "Close",
  },
  chat: {
    open: "Open chat",
    close: "Close chat",
    minimize: "Minimize",
    greeting: "Hello 👋",
    welcome: "Welcome to ABB!",
    askTitle: "Ask a question",
    askHint: "We're here for you 24/7",
    placeholder: "Type your message...",
    send: "Send",
    typing: "ABB is typing…",
    suggestions: ["Cards", "Cash loan", "Branches", "937"],
    botReplyDefault:
      "Ask about cards, loans, deposits or branches. For more help call 937.",
    botReplyCards:
      "You can order debit and credit cards online under Personal → Cards.",
    botReplyLoan:
      "Apply for a cash loan via ABB mobile or the website: Personal → Loans → Cash loan.",
    botReplyBranch:
      "Use the Service network button or open /filiallar for branches and ATMs.",
    botReplyPhone:
      "24/7 Call Center: 937. Other contacts: +994 12 493 00 91 · info@abb-bank.az",
    botReplyDeposit:
      "Deposits and DigiDeposit are under Personal → Deposits. Online opening is available in ABB mobile.",
  },
  form: {
    success: "Your application was received (demo).",
    invalidPhone: "Enter a valid mobile number",
    invalidFin: "FIN code must be 7 characters",
  },
};

export type Dictionary = DeepString<typeof az>;

export function getDictionary(locale: Locale): Dictionary {
  return locale === "en" ? en : az;
}
