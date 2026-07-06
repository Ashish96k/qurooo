import { cn } from "@/lib/cn";

interface StyleMosaicIconProps {
  primary: string;
  secondary: string;
  className?: string;
}

const activeMask = [1, 0, 1, 1, 1, 0, 0, 1, 1];

export function StyleMosaicIcon({ className, primary, secondary }: StyleMosaicIconProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-[2px] rounded-[8px] bg-white p-[5px] shadow-[0_4px_10px_rgba(15,23,42,0.08)]",
        className,
      )}
    >
      {activeMask.map((isActive, index) => (
        <span
          key={index}
          className="aspect-square rounded-[2px]"
          style={{
            backgroundColor: isActive ? (index % 2 === 0 ? primary : secondary) : "transparent",
          }}
        />
      ))}
    </div>
  );
}
