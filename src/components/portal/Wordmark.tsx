import { cn } from "@/lib/utils";

// Text wordmark matching the website hero (Cinzel "MURIVEST", hairline, Jost "GROUP").
// Swap the contents here for the logo image once it is supplied.
const SIZES = {
  sm: { mark: "text-base", group: "text-[6px] mt-1", rule: "mt-1" },
  md: { mark: "text-2xl", group: "text-[8px] mt-1.5", rule: "mt-1.5" },
  lg: { mark: "text-4xl", group: "text-[10px] mt-2", rule: "mt-2" },
} as const;

export function Wordmark({
  size = "md",
  className,
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <span className={cn("inline-flex flex-col items-center text-foreground", className)} aria-label="Murivest Group">
      <span className={cn("font-display uppercase leading-none tracking-[0.1em] pl-[0.1em]", s.mark)}>Murivest</span>
      <span className={cn("block h-px w-full bg-current", s.rule)} />
      <span className={cn("font-sans font-light uppercase tracking-[0.5em] pl-[0.5em]", s.group)}>Group</span>
    </span>
  );
}
