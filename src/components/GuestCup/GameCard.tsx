"use client";

import { Card } from "@/components/ui/card";
import { getCountryLabel } from "@/lib/utils";
import { useCountdown, pad } from "@/hooks/useCountdown";
import { Clock } from "lucide-react";
import { Game, Prediction } from "@/lib/type";
import { CountryFlag } from "./CountryFlag";
import { GameStatusBadge, OutcomeBadge } from "./GameStatusBadge";
import { useState } from "react";

function getOutcome(
	predictedA: number | string,
	predictedB: number | string,
	realA: number | string,
	realB: number | string,
): "exact" | "winner" | "miss" {
	const pa = Number(predictedA);
	const pb = Number(predictedB);
	const ra = Number(realA);
	const rb = Number(realB);

	if (pa === ra && pb === rb) return "exact";
	return Math.sign(pa - pb) === Math.sign(ra - rb) ? "winner" : "miss";
}

function TeamBlock({ nome }: { nome: string }) {
	return (
		<div className="flex flex-1 flex-col items-center gap-1.5 text-center">
			<CountryFlag
				nome={nome}
				className="w-8 h-6 border border-neutral-800 bg-neutral-900"
			/>

			<span className="text-xs font-medium text-neutral-400 line-clamp-1">
				{getCountryLabel(nome)}
			</span>
		</div>
	);
}

export function GameCard({
	game,
	userPrediction,
	predictionLoading = false,
	onClick,
}: {
	game: Game;
	userPrediction?: Prediction;
	predictionLoading?: boolean;
	onClick: (locked: boolean) => void;
}) {
	const kickoffDate = new Date(game.game_date_time).getTime();
	const cd = useCountdown(kickoffDate);

	const [kickoffPassed] = useState(() => Date.now() >= kickoffDate);

	const isFinished = game.real_score_a !== "" && game.real_score_b !== "";
	const isLocked = isFinished || cd.isDone || kickoffPassed;
	const isOpen = !isLocked;

	const outcome =
		isFinished && userPrediction
			? getOutcome(
					userPrediction.predicted_score_a,
					userPrediction.predicted_score_b,
					game.real_score_a,
					game.real_score_b,
				)
			: null;

	return (
		<Card
			role="button"
			tabIndex={predictionLoading ? -1 : 0}
			onClick={() => !predictionLoading && onClick(isLocked)}
			onKeyDown={(e) => {
				if ((e.key === "Enter" || e.key === " ") && !predictionLoading) {
					e.preventDefault();
					onClick(isLocked);
				}
			}}
			className={`group cursor-pointer gap-0 overflow-hidden border-neutral-800 bg-neutral-900/40 p-0 transition-all hover:-translate-y-0.5 hover:border-[#d4af37]/40 hover:bg-neutral-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] ${predictionLoading ? "opacity-60 pointer-events-none" : ""}`}
		>
			<div className="flex items-center justify-between gap-2 border-b border-neutral-800 bg-neutral-950/20 px-4 py-2.5">
				<span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
					{game.group_round}
				</span>
				<GameStatusBadge
					isFinished={isFinished}
					isLocked={isLocked && !isFinished}
				/>
			</div>

			<div className="flex items-center justify-between gap-3 px-4 py-5">
				<TeamBlock nome={game.team_a} />

				<div className="flex flex-col items-center gap-1 px-1">
					{isFinished ? (
						<div className="flex items-center gap-1.5 font-mono text-xl font-bold tabular-nums text-neutral-100 sm:text-2xl">
							<span>{game.real_score_a}</span>
							<span className="text-sm text-neutral-600">×</span>
							<span>{game.real_score_b}</span>
						</div>
					) : (
						<span className="text-xs font-medium lowercase tracking-wide text-neutral-500">
							vs
						</span>
					)}
				</div>

				<TeamBlock nome={game.team_b} />
			</div>

			<div className="flex items-center justify-between gap-2 border-t border-neutral-800 px-4 py-3 bg-neutral-950/10">
				{isOpen ? (
					<span className="flex items-center gap-1.5 font-mono text-xs font-medium text-neutral-300">
						<Clock className="size-3.5 text-[#d4af37] animate-pulse" />
						{pad(cd.hours)}:{pad(cd.minutes)}:{pad(cd.seconds)}
					</span>
				) : (
					<span className="flex items-center gap-1.5 font-mono text-xs text-neutral-500">
						<Clock className="size-3.5" />
						00:00:00
					</span>
				)}

				<div className="text-right">
					{predictionLoading ? (
						<span className="inline-flex h-4 w-20 animate-pulse rounded bg-neutral-800" />
					) : isFinished ? (
						outcome ? (
							<OutcomeBadge
								outcome={outcome}
								className="text-[11px] px-2.5 py-1"
							/>
						) : (
							<span className="text-xs font-medium text-neutral-500">
								Sem palpite
							</span>
						)
					) : userPrediction ? (
						<span className="text-xs font-mono text-neutral-400">
							Palpite:{" "}
							<strong className="text-neutral-200">
								{userPrediction.predicted_score_a} ×{" "}
								{userPrediction.predicted_score_b}
							</strong>
						</span>
					) : (
						<span className="text-xs font-medium text-neutral-500">
							Sem palpite
						</span>
					)}
				</div>
			</div>
		</Card>
	);
}
