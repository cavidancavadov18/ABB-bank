import branchesJson from "./networkBranches.json";

export type NetworkTabId =
  | "filiallar"
  | "shobeler"
  | "atm"
  | "cash-in"
  | "terminallar"
  | "xaricde";

export type NetworkBranch = {
  id: number;
  title: string;
  address: string;
  director: string | null;
  branch_code: number | null;
  lat: number;
  lng: number;
  phones: string[];
  work_time: string[];
  subways: string[];
  weekend: boolean;
};

export type NetworkFilter = "" | "open_on_weekends" | "safe_box" | "ADM";

export const networkBranches = branchesJson as NetworkBranch[];

export const networkTabs: {
  id: NetworkTabId;
  az: string;
  en: string;
  href: string;
}[] = [
  { id: "filiallar", az: "Filiallar", en: "Branches", href: "filiallar" },
  { id: "shobeler", az: "Şöbələr", en: "Departments", href: "shobeler" },
  { id: "atm", az: "ATM-lər", en: "ATMs", href: "atm" },
  { id: "cash-in", az: "Cash-in ATM-lər", en: "Cash-in ATMs", href: "cash-in" },
  { id: "terminallar", az: "Terminallar", en: "Terminals", href: "terminallar" },
  { id: "xaricde", az: "Xaricdə", en: "Abroad", href: "xaricde" },
];

export const networkFilters: { id: NetworkFilter; az: string; en: string }[] = [
  { id: "", az: "Hamısı", en: "All" },
  {
    id: "open_on_weekends",
    az: "Həftəsonu işləyən filiallar",
    en: "Open on weekends",
  },
  { id: "safe_box", az: "Seyf olan filiallar", en: "Branches with safe" },
  { id: "ADM", az: "ADM", en: "ADM" },
];

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
