"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Clock, Lock, Save } from "lucide-react";
import { Game, Prediction } from "@/lib/type";
import { getCountryLabel } from "@/lib/utils";
import { GameStatusBadge } from "./GameStatusBadge";
import { ScoreCompare } from "./ScoreCompare";
import { pad, useCountdown } from "@/hooks/useCountdown";
import { CountryFlag } from "./CountryFlag";

export function GameModal({
	game,
	initialLocked,
	userPrediction,
	open,
	onOpenChange,
	onSave,
	submitting = false,
}: {
	game: Game | null;
	initialLocked: boolean;
	userPrediction?: Prediction;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: (gameId: string | number, scoreA: number, scoreB: number) => void;
	submitting?: boolean;
}) {
	const [currentGameId, setCurrentGameId] = useState<string | number | null>(
		game?.game_id ?? null,
	);
	const [a, setA] = useState(() =>
		userPrediction ? String(userPrediction.predicted_score_a) : "",
	);
	const [b, setB] = useState(() =>
		userPrediction ? String(userPrediction.predicted_score_b) : "",
	);

	if (game && game.game_id !== currentGameId) {
		setCurrentGameId(game.game_id);
		setA(userPrediction ? String(userPrediction.predicted_score_a) : "");
		setB(userPrediction ? String(userPrediction.predicted_score_b) : "");
	}

	const kickoffTime = game ? new Date(game.game_date_time).getTime() : 0;
	const cd = useCountdown(kickoffTime);

	if (!game) return null;

	const isFinished = game.real_score_a !== "" && game.real_score_b !== "";
	const isLocked = isFinished || cd.isDone || initialLocked;
	const isOpen = !isLocked;
	const hasPrediction = !!userPrediction;

	function clamp(v: string) {
		const cleaned = v.replace(/[^0-9]/g, "");
		if (!cleaned) return "";
		const n = Number.parseInt(cleaned, 10);
		return String(Math.min(20, Math.max(0, n)));
	}

	function handleSave() {
		if (!game) return;

		const na = Number.parseInt(a, 10);
		const nb = Number.parseInt(b, 10);
		if (Number.isNaN(na) || Number.isNaN(nb)) return;

		onSave(game.game_id, na, nb);
	}
	const canSave = a !== "" && b !== "" && !submitting;

	const teamALabel = getCountryLabel(game.team_a);
	const teamBLabel = getCountryLabel(game.team_b);

	// Valor a exibir no lugar do input quando o jogo não está mais aberto
	const displayScoreA = isFinished
		? game.real_score_a
		: (userPrediction?.predicted_score_a ?? null);
	const displayScoreB = isFinished
		? game.real_score_b
		: (userPrediction?.predicted_score_b ?? null);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md border-neutral-800 bg-[#0c0b08] text-neutral-100 shadow-2xl">
				<DialogHeader>
					<div className="flex items-center justify-between gap-4 pr-4">
						<DialogTitle className="text-sm font-bold uppercase tracking-wider text-neutral-400">
							{game.group_round}
						</DialogTitle>
						<GameStatusBadge
							isFinished={isFinished}
							isLocked={isLocked && !isFinished}
						/>
					</div>
					<DialogDescription className="sr-only">
						Insira ou visualize seu palpite para este jogo da rodada.
					</DialogDescription>
				</DialogHeader>

				<div className="flex items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950/60 py-2.5">
					{isOpen ? (
						<>
							<Clock className="size-4 text-[#f4d67a] animate-pulse" />
							<span className="font-mono text-sm font-bold tabular-nums text-neutral-200">
								{pad(cd.hours)}:{pad(cd.minutes)}:{pad(cd.seconds)}
							</span>
							<span className="text-xs text-neutral-400">
								para fechar as apostas
							</span>
						</>
					) : (
						<>
							<Lock className="size-4 text-neutral-500" />
							<span className="text-xs font-semibold text-neutral-400">
								{isFinished ? "Jogo finalizado" : "Palpites encerrados"}
							</span>
						</>
					)}
				</div>

				<div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3 py-4">
					{/* Time A */}
					<div className="flex flex-col items-center gap-2 text-center">
						<CountryFlag
							nome={game.team_a}
							className="w-12 h-9 border border-neutral-800 bg-neutral-900"
						/>
						<span className="text-sm font-bold text-neutral-200 line-clamp-2 min-h-[40px]">
							{teamALabel}
						</span>

						{isOpen ? (
							<>
								<Label htmlFor="score-a" className="sr-only">
									Placar {teamALabel}
								</Label>
								<Input
									id="score-a"
									type="text"
									inputMode="numeric"
									value={a}
									onChange={(e) => setA(clamp(e.target.value))}
									className="h-14 w-16 text-center font-mono text-2xl font-black border-neutral-800 bg-neutral-950 text-neutral-100 focus-visible:ring-[#d4af37]"
								/>
							</>
						) : (
							<span className="flex h-14 w-16 items-center justify-center font-mono text-2xl font-black text-neutral-100">
								{displayScoreA ?? (
									<span className="text-base font-normal text-neutral-600">
										—
									</span>
								)}
							</span>
						)}
					</div>

					<span className="pt-16 text-xl font-bold text-neutral-600 select-none">
						×
					</span>

					{/* Time B */}
					<div className="flex flex-col items-center gap-2 text-center">
						<CountryFlag
							nome={game.team_b}
							className="w-12 h-9 border border-neutral-800 bg-neutral-900"
						/>
						<span className="text-sm font-bold text-neutral-200 line-clamp-2 min-h-[40px]">
							{teamBLabel}
						</span>

						{isOpen ? (
							<>
								<Label htmlFor="score-b" className="sr-only">
									Placar {teamBLabel}
								</Label>
								<Input
									id="score-b"
									type="text"
									inputMode="numeric"
									value={b}
									onChange={(e) => setB(clamp(e.target.value))}
									className="h-14 w-16 text-center font-mono text-2xl font-black border-neutral-800 bg-neutral-950 text-neutral-100 focus-visible:ring-[#d4af37]"
								/>
							</>
						) : (
							<span className="flex h-14 w-16 items-center justify-center font-mono text-2xl font-black text-neutral-100">
								{displayScoreB ?? (
									<span className="text-base font-normal text-neutral-600">
										—
									</span>
								)}
							</span>
						)}
					</div>
				</div>

				{!isOpen && (
					<div className="pt-2">
						{hasPrediction ? (
							<ScoreCompare
								predictedA={userPrediction?.predicted_score_a}
								predictedB={userPrediction?.predicted_score_b}
								realA={game.real_score_a}
								realB={game.real_score_b}
							/>
						) : (
							<div className="rounded-lg border border-neutral-800 bg-neutral-950/40 px-4 py-3 text-center">
								<p className="text-sm font-medium text-neutral-400">
									Você não registrou um palpite para este jogo.
								</p>
							</div>
						)}
					</div>
				)}

				<DialogFooter className="pt-2">
					{isOpen ? (
						<Button
							onClick={handleSave}
							disabled={!canSave}
							className="w-full gap-2 bg-gradient-to-r from-[#f4d67a] to-[#d4af37] text-neutral-950 font-bold hover:brightness-110"
						>
							<Save className="size-4" />
							{submitting ? "Salvando..." : "Salvar Palpite"}
						</Button>
					) : (
						<Button
							variant="outline"
							onClick={() => onOpenChange(false)}
							className="w-full border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
						>
							Fechar
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
