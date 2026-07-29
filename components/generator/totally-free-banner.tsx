import Image from "next/image";

const perks = ["No sign up.", "No limits.", "Just creativity!"];

/**
 * Background "blob" is a real, high-resolution PNG (generated fresh at
 * 960x554 with a transparent alpha channel — not scaled from a screenshot)
 * so the "bone" silhouette and cyan-to-lavender gradient stay crisp and
 * free of compression artifacts. The doodle arrow — a dashed line with a
 * small hand-drawn loop that exits horizontally from the right lobe — is
 * drawn as SVG in the same 960x554 coordinate space as the image so it
 * lines up with the shape exactly at any container size, and stays sharp
 * since thin dashed strokes are the one thing raster images render badly
 * at small sizes.
 */
export function TotallyFreeBanner() {
  return (
    <aside
      className="relative overflow-visible pr-6 pt-2"
      aria-label="Totally Free — No sign up. No limits. Just creativity!"
    >
      <div className="relative w-full overflow-visible" style={{ aspectRatio: "960 / 554" }}>
        <Image
          src="/icons/totally-free-blob.png"
          alt=""
          fill
          priority
          className="pointer-events-none select-none object-contain object-left"
          style={{ filter: "drop-shadow(0 14px 22px rgba(101, 88, 232, 0.28))" }}
          sizes="320px"
          aria-hidden
        />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 960 554"
          preserveAspectRatio="none"
          aria-hidden
        >
          {/* Small decorative sparkle trail curving across the top of the shape */}
          <g fill="#ffffff" fillOpacity="0.85">
            <circle cx="230" cy="55" r="6" />
            <circle cx="258" cy="62" r="5.5" />
            <circle cx="285" cy="71" r="5" />
            <circle cx="311" cy="82" r="4.2" />
            <circle cx="335" cy="94" r="3.4" />
            <circle cx="356" cy="106" r="2.6" />
            <circle cx="374" cy="118" r="1.8" />
          </g>

          {/* Doodle arrow: dashed line with a small loop, exiting the right lobe */}
          <path
            d="M470,322 C512,344 552,344 580,326
               C602,312 616,294 630,288
               C644,282 650,268 636,262
               C622,256 614,272 628,282
               C654,300 690,292 722,276
               C758,258 792,246 826,238"
            stroke="#1c1830"
            strokeOpacity="0.88"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray="3 22"
            fill="none"
          />
          <path
            d="M826,238 C856,231 884,222 906,212"
            stroke="#b98af0"
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M880,196 L910,210 L892,234"
            stroke="#b98af0"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Sparkle accents around the arrow */}
          <path
            d="M700,238 L706,222 L712,238 L728,244 L712,250 L706,266 L700,250 L684,244 Z"
            fill="#1c1830"
            fillOpacity="0.8"
          />
          <path
            d="M842,190 L847,178 L852,190 L864,195 L852,200 L847,212 L842,200 L830,195 Z"
            fill="#b98af0"
          />
          <circle cx="612" cy="352" r="4" fill="#1c1830" fillOpacity="0.55" />
          <circle cx="760" cy="300" r="3.2" fill="#1c1830" fillOpacity="0.5" />
        </svg>

        <div className="relative z-10 flex h-full max-w-[52%] flex-col items-start justify-center pl-7 sm:pl-8">
          <p className="whitespace-nowrap text-[15px] font-bold leading-tight tracking-tight text-white sm:text-base">
            Totally Free
          </p>
          <ul className="mt-2 space-y-1">
            {perks.map((perk) => (
              <li
                key={perk}
                className="whitespace-nowrap text-[12px] leading-snug text-white/95 sm:text-[13px]"
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
