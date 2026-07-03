import { cn } from "@/lib/utils";

function ScoreLine({
	label,
	a,
	b,
	highlight,
}: {
	label: string;
	a: number | string | undefined;
	b: number | string | undefined;
	highlight?: boolean;
}) {
	return (
		<div
			className={cn(
				"flex items-center justify-between rounded-lg border px-3 py-2.5 transition-all",
				highlight
					? "border-[#d4af37]/30 bg-[#d4af37]/5"
					: "border-neutral-800 bg-neutral-950/40",
			)}
		>
			<span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
				{label}
			</span>
			<span
				className={cn(
					"font-mono text-base font-bold tabular-nums",
					highlight ? "text-[#f4d67a]" : "text-neutral-200",
				)}
			>
				{a ?? "-"} <span className="text-neutral-600 font-sans">×</span>{" "}
				{b ?? "-"}
			</span>
		</div>
	);
}

export function ScoreCompare({
	predictedA,
	predictedB,
	realA,
	realB,
}: {
	predictedA?: number | string;
	predictedB?: number | string;
	realA?: number | string;
	realB?: number | string;
}) {
	const hasRealResult = realA !== undefined && realA !== "";

	return (
		<div className="grid gap-2 w-full">
			<ScoreLine label="Seu palpite" a={predictedA} b={predictedB} highlight />
			{hasRealResult && (
				<ScoreLine label="Resultado real" a={realA} b={realB} />
			)}
		</div>
	);
}
