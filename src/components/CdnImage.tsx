"use client";

import Image, { type ImageProps } from "next/image";
import { useState, type CSSProperties } from "react";

/** Prefer full-res CDN (`large_…`) when available. */
export function upgradeCdnUrl(src: string) {
  if (!src.includes("cdn.abb-bank.az")) return src;
  if (/\.svg($|\?)/i.test(src)) return src;
  // Capital-I `Image_*` tiles often have no `large_` twin — keep plain URL
  if (/\/Image_/.test(src) || /\/large_Image_/.test(src)) {
    return src.replace("/large_Image_", "/Image_");
  }
  if (/\/(icon_|small_|large_)/i.test(src)) {
    return src.replace("/medium_", "/large_");
  }
  if (/\/medium_/i.test(src)) return src.replace("/medium_", "/large_");
  return src.replace("cdn.abb-bank.az/", "cdn.abb-bank.az/large_");
}

function plainCdnFallback(src: string) {
  return src.replace(/cdn\.abb-bank\.az\/large_/i, "cdn.abb-bank.az/");
}

/**
 * Serve abb-bank CDN assets at full resolution (no Next.js resize downscale).
 */
export function CdnImage({ src, alt, ...props }: ImageProps) {
  const initial =
    typeof src === "string" ? upgradeCdnUrl(src) : src;
  const [current, setCurrent] = useState(initial);

  return (
    <Image
      {...props}
      src={current}
      alt={alt}
      unoptimized
      quality={100}
      onError={() => {
        if (typeof current === "string" && /\/large_/i.test(current)) {
          setCurrent(plainCdnFallback(current));
        }
      }}
    />
  );
}

/** Plain &lt;img&gt; for section pages — full CDN resolution, no Next resize. */
export function FullImg({
  src,
  alt,
  className,
  style,
  eager,
  /** When false, keep the exact CDN path (some `large_*` twins are wrong crops). */
  hq = true,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
  hq?: boolean;
}) {
  const preferred = hq ? upgradeCdnUrl(src) : plainCdnFallback(src);
  const [fallback, setFallback] = useState<string | null>(null);
  const current = fallback ?? preferred;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={className}
      style={style}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        if (!hq || fallback) return;
        const next = plainCdnFallback(preferred);
        if (next !== preferred) setFallback(next);
      }}
    />
  );
}
