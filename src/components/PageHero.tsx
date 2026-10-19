import { CdnImage } from "@/components/CdnImage";

type Props = {
  title: string;
  subtitle: string;
  image?: string;
  gradient?: string;
};

export function PageHero({
  title,
  subtitle,
  image,
  gradient = "linear-gradient(135deg, #1b63ed 0%, #2563eb 45%, #4f46e5 100%)",
}: Props) {
  return (
    <section className="container-abb pt-6 md:pt-8">
      <div
        className="relative overflow-hidden rounded-[32px] px-6 py-12 shadow-lg md:px-12 md:py-16"
        style={{ background: gradient }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.22),transparent_40%)]" />
        <div className="relative z-10 grid items-center gap-8 md:grid-cols-[1.15fr_1fr]">
          <div className="max-w-2xl">
            <h1 className="text-[32px] font-semibold leading-tight text-white md:text-[44px]">
              {title}
            </h1>
            <p className="mt-4 text-[16px] leading-relaxed text-white/90 md:text-[18px]">
              {subtitle}
            </p>
          </div>
          {image && (
            <div className="relative mx-auto h-48 w-full max-w-md sm:h-56 md:h-64 lg:h-72">
              <CdnImage
                src={image}
                alt={title}
                fill
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 90vw, 420px"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
