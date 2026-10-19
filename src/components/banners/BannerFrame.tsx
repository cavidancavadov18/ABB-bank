import type { CSSProperties, ReactNode } from "react";

/** Medium inset banner shell — not full-bleed giant, not cramped. */
export const BANNER_IMG = {
  maxWidth: 420,
  maxHeight: 360,
} as const;

type Props = {
  children: ReactNode;
  background: string;
  className?: string;
  style?: CSSProperties;
};

export function BannerFrame({ children, background, className = "", style }: Props) {
  return (
    <div className="container-abb mb-8 md:mb-10">
      <section
        className={`overflow-hidden rounded-[24px] md:rounded-[32px] ${className}`}
        style={{ background, ...style }}
      >
        <div className="px-5 py-7 md:px-8 md:py-8 lg:px-10 lg:py-9">{children}</div>
      </section>
    </div>
  );
}

export function BannerMedia({ children }: { children: ReactNode }) {
  return (
    <div
      className="mx-auto flex w-full flex-1 items-center justify-center self-center overflow-hidden md:ml-auto md:mr-0"
      style={{
        maxWidth: BANNER_IMG.maxWidth,
        height: `min(${BANNER_IMG.maxHeight}px, 48vw)`,
        maxHeight: BANNER_IMG.maxHeight,
      }}
    >
      {children}
    </div>
  );
}

export const bannerImgStyle: CSSProperties = {
  maxHeight: "100%",
  maxWidth: "100%",
  width: "auto",
  height: "auto",
};
