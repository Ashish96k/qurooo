import Image from "next/image";

const perks = ["No sign up.", "No limits.", "Just creativity!"];

/**
 * Uses the native 428×266 blob PNG (shape + looped arrow) and overlays
 * the Totally Free copy on the left lobe. Width is capped at the 296px
 * left column so it stays this size on every breakpoint.
 */
export function TotallyFreeBanner() {
  return (
    <aside
      className="relative w-full max-w-[296px] min-w-0 justify-self-start overflow-visible pt-1"
      aria-label="Totally Free — No sign up. No limits. Just creativity!"
    >
      <div className="relative w-full overflow-visible" style={{ aspectRatio: "428 / 266" }}>
        <Image
          src="/icons/totally-free-blob.png"
          alt=""
          fill
          priority
          unoptimized
          className="pointer-events-none select-none object-contain object-left"
          style={{ filter: "drop-shadow(0 10px 18px rgba(101, 88, 232, 0.18))" }}
          sizes="296px"
          aria-hidden
        />

        <div className="relative z-10 flex h-full w-[48%] flex-col justify-center pl-9">
          <p className="whitespace-nowrap text-[14px] font-bold leading-none tracking-tight text-white sm:text-[15px]">
            Totally Free
          </p>
          <ul className="mt-1.5 space-y-px">
            {perks.map((perk) => (
              <li
                key={perk}
                className="whitespace-nowrap text-[11px] leading-[1.35] text-white/95 sm:text-[12px]"
              >
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
