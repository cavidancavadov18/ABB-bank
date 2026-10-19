/** ABB emblem mark (spinning) — use currentColor */
export function AbbMark({
  className = "",
  size = 40,
  spin = true,
}: {
  className?: string;
  size?: number;
  spin?: boolean;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={`${spin ? "abb-logo-mark" : ""} shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.9119 0.618454C14.2789 3.10236 12.1002 6.95464 11.1249 11.072L13.9437 13.8774C14.6656 8.96729 17.3869 4.87167 19.9234 3.42217C20.2041 3.5699 21.0144 4.11148 21.655 4.79706C21.7693 4.74672 21.8838 4.69596 21.9986 4.64506C22.9579 4.21958 23.9395 3.78423 25.079 3.50292C23.8587 2.06813 23.1053 1.46608 22.0176 0.678361C20.802 -0.202197 19.1512 -0.228987 17.9119 0.618454ZM4.85245 7.66031C4.04844 11.9736 5.24502 16.2305 7.4806 19.8285H11.4669C8.48894 15.8484 7.50321 11.0375 8.26704 8.22739C8.57043 8.13436 9.52812 7.9472 10.4682 7.98106C10.5129 7.86603 10.5573 7.75066 10.6019 7.63496C10.9783 6.65798 11.3633 5.65831 11.9698 4.65641C10.0876 4.50069 9.12714 4.60506 7.7982 4.81343C6.31299 5.04636 5.12688 6.18906 4.85245 7.66031ZM19.9233 7.44477C23.5385 5.21983 27.816 4.02895 32.1498 4.82914C33.6281 5.10225 34.7764 6.28272 35.0105 7.76087C35.2197 9.08347 35.3247 10.0394 35.1683 11.9127C34.1608 11.3086 33.1558 10.9252 32.1735 10.5505C32.0579 10.5064 31.9425 10.4624 31.8276 10.4182C31.8617 9.48254 31.6737 8.52941 31.58 8.22746C28.7565 7.46728 23.9227 8.4483 19.9233 11.412V7.44477ZM39.2257 17.8266C36.73 14.2108 32.8593 12.0426 28.7222 11.0719L25.9033 13.8773C30.837 14.5958 34.9522 17.3041 36.4086 19.8285C36.2602 20.108 35.7161 20.9141 35.0272 21.5519C35.0777 21.6656 35.1287 21.7793 35.1797 21.8934L35.1806 21.8954C35.6079 22.8496 36.045 23.8259 36.3275 24.9595C37.7691 23.7451 38.3741 22.9953 39.1655 21.9128C40.0504 20.703 40.0773 19.06 39.2257 17.8266ZM32.3666 19.8283C34.6022 23.4262 35.7988 27.6832 34.9946 31.9965C34.7203 33.4678 33.5342 34.6107 32.049 34.8436C30.7201 35.0518 29.7595 35.1561 27.8773 35.0004C28.4836 33.9989 28.8687 32.9995 29.245 32.0228C29.2899 31.9061 29.3343 31.7908 29.379 31.6758C30.3191 31.7098 31.2766 31.5227 31.5802 31.4295C32.344 28.6194 31.3583 23.8084 28.3802 19.8283H32.3666ZM21.9349 39.039C25.5681 36.5551 27.7466 32.7027 28.722 28.5854L25.9032 25.7799C25.1813 30.6901 22.46 34.7855 19.9235 36.2351C19.6427 36.0873 18.8326 35.5457 18.1919 34.8603C18.078 34.9105 17.9639 34.9611 17.8496 35.0118C16.8899 35.4374 15.908 35.8728 14.7679 36.1544C15.9883 37.5893 16.7416 38.1913 17.8292 38.9791C19.0449 39.8596 20.6957 39.8862 21.9349 39.039ZM19.9234 32.2124C16.3083 34.4374 12.0308 35.6283 7.69701 34.8279C6.21872 34.5549 5.07037 33.3743 4.83651 31.8962C4.62714 30.5738 4.52227 29.6179 4.67855 27.7444C5.68453 28.3476 6.68813 28.7306 7.66895 29.105C7.7861 29.1497 7.90288 29.1942 8.0193 29.239C7.98509 30.1747 8.17333 31.1276 8.26679 31.4296C11.0903 32.1899 15.9243 31.2087 19.9234 28.245V32.2124ZM0.621413 21.8306C3.1172 25.4466 6.98792 27.6146 11.125 28.5854L13.9438 25.7802C9.0102 25.0615 4.89497 22.3532 3.43855 19.8287C3.58698 19.5493 4.13115 18.7429 4.82001 18.1054C4.7695 17.9917 4.71856 17.8779 4.66748 17.7639C4.23993 16.8091 3.80239 15.832 3.51968 14.6978C2.07802 15.9123 1.4731 16.6622 0.681607 17.7444C-0.203164 18.9545 -0.230083 20.5973 0.621413 21.8306Z"
      />
    </svg>
  );
}

/** Unified ABB lockup — blue mark + wordmark, spinning emblem */
export function Logo({
  className = "",
  compact = false,
  tone = "blue",
}: {
  className?: string;
  /** Smaller mark + no tagline (e.g. network panel) */
  compact?: boolean;
  /** Footer / dark surfaces */
  tone?: "blue" | "white";
}) {
  const markSize = compact ? 32 : 40;
  return (
    <span
      className={`inline-flex items-center ${
        tone === "white" ? "text-white" : "text-[#1B63ED]"
      } ${compact ? "gap-2" : "gap-2.5"} ${className}`}
      aria-label="ABB — Azərbaycan Beynəlxalq Bankı"
    >
      <AbbMark size={markSize} />
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={`font-bold tracking-tight ${
            compact ? "text-[22px]" : "text-[28px]"
          }`}
        >
          ABB
        </span>
        <span
          className={`mt-0.5 font-medium tracking-[-0.01em] ${
            compact ? "text-[7.5px]" : "text-[9px]"
          }`}
        >
          Azərbaycan Beynəlxalq Bankı
        </span>
      </span>
    </span>
  );
}

export function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

export function PinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

export function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011.1-.24c1.2.4 2.5.62 3.8.62a1 1 0 011 1V20a1 1 0 01-1 1C10.4 21 3 13.6 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.3.22 2.6.62 3.8a1 1 0 01-.24 1.1L6.6 10.8z" />
    </svg>
  );
}

export function ChevronDown({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowUpRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronLeft({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRight({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MenuIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
