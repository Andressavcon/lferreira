"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	LogOut,
	Star,
	Trophy,
	Loader2,
	RefreshCw,
	EyeOff,
	Eye,
} from "lucide-react";
import { toast } from "sonner";
import { sweepstakesApi } from "@/lib/api";
import {
	getCachedGames,
	setCachedGames,
	clearGamesCache,
} from "@/lib/gamesCache";
import { GameCard } from "@/components/GuestCup/GameCard";
import { GameModal } from "@/components/GuestCup/GameModal";
import {
	RankingScreen,
	Participant,
} from "@/components/GuestCup/RankingScreen";
import { Game, Prediction } from "@/lib/type";
import { motion, AnimatePresence } from "framer-motion";

function isGameFinished(game: Game) {
	return game.real_score_a !== "" && game.real_score_b !== "";
}

export default function DashboardPage() {
	const router = useRouter();

	const [userName, setUserName] = useState("Participante");
	const [userEmail, setUserEmail] = useState("");
	const [userPoints, setUserPoints] = useState(0);

	const [games, setGames] = useState<Game[]>([]);
	const [predictions, setPredictions] = useState<Prediction[]>([]);
	const [rankingList, setRankingList] = useState<Participant[]>([]);

	const [gamesLoading, setGamesLoading] = useState(true);
	const [extrasLoading, setExtrasLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const [hideFinished, setHideFinished] = useState(true);

	const [showRanking, setShowRanking] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedGame, setSelectedGame] = useState<Game | null>(null);
	const [submittingPrediction, setSubmittingPrediction] = useState(false);

	useEffect(() => {
		const storedEmail = localStorage.getItem("guest_email");
		const storedName = localStorage.getItem("guest_name");

		if (!storedEmail) {
			toast.error("Sessão expirada. Por favor, faça login novamente.");
			router.push("/guest-cup");
			return;
		}

		setUserEmail(storedEmail);
		if (storedName) setUserName(storedName);

		const cached = getCachedGames();
		if (cached) {
			setGames(cached);
			setGamesLoading(false);
		}
		loadGames();
		loadExtras(storedEmail, cached ?? undefined);
	}, []);

	const loadGames = async () => {
		try {
			const freshGames = await sweepstakesApi.getGames();
			setGames(freshGames);
			setCachedGames(freshGames);
		} catch (error) {
			console.error("Erro ao buscar jogos:", error);
			if (!getCachedGames()) {
				toast.error("Não foi possível carregar os jogos.");
			}
		} finally {
			setGamesLoading(false);
		}
	};

	const loadExtras = async (email: string, gamesForRanking?: Game[]) => {
		setExtrasLoading(true);
		try {
			const [predictionsData, participantsData, allPredictionsData] =
				await Promise.all([
					sweepstakesApi.getPredictions(email).catch(() => []),
					sweepstakesApi.getParticipants().catch(() => []),
					sweepstakesApi.getAllPredictions().catch(() => []),
				]);

			setPredictions(predictionsData);

			const gamesForCalc =
				gamesForRanking ??
				getCachedGames() ??
				(await sweepstakesApi.getGames());

			const activeRanking = participantsData.map((participant, index) => {
				let points = 0;
				const userGuesses = allPredictionsData.filter(
					(p) =>
						String(p.email).toLowerCase() ===
						String(participant.email).toLowerCase(),
				);

				userGuesses.forEach((guess) => {
					const game = gamesForCalc.find(
						(g) => String(g.game_id) === String(guess.game_id),
					);
					if (game && game.real_score_a !== "" && game.real_score_b !== "") {
						const rA = Number(game.real_score_a);
						const rB = Number(game.real_score_b);
						const pA = Number(guess.predicted_score_a);
						const pB = Number(guess.predicted_score_b);

						const exactWeight = Number(game.points_exact || 0);
						const winnerWeight = Number(game.points_winner || 0);

						if (pA === rA && pB === rB) {
							points += exactWeight;
						} else if (
							(pA > pB && rA > rB) ||
							(pA < pB && rA < rB) ||
							(pA === pB && rA === rB)
						) {
							points += winnerWeight;
						}
					}
				});

				return {
					id: participant.email || String(index),
					name: participant.name,
					points: points,
					isCurrentUser:
						String(participant.email).toLowerCase() ===
						String(email).toLowerCase(),
				};
			});

			const sortedRanking = activeRanking.sort((a, b) => b.points - a.points);
			setRankingList(sortedRanking);

			const currentUserScore = sortedRanking.find((p) => p.isCurrentUser);
			if (currentUserScore) {
				setUserPoints(currentUserScore.points);
			}
		} catch (error) {
			console.error("Erro ao buscar dados do Dashboard:", error);
			toast.error("Não foi possível carregar os dados atualizados.");
		} finally {
			setExtrasLoading(false);
		}
	};

	const handleRefresh = async () => {
		if (!userEmail) return;
		setRefreshing(true);
		await Promise.all([loadGames(), loadExtras(userEmail)]);
		setRefreshing(false);
	};

	const handleLogout = () => {
		localStorage.removeItem("guest_email");
		localStorage.removeItem("guest_name");
		clearGamesCache();
		toast.success("Você saiu do painel.");
		router.push("/guest-cup");
	};

	const handleOpenGame = (game: Game) => {
		setSelectedGame(game);
		setIsModalOpen(true);
	};

	const handleSavePrediction = async (
		gameId: string | number,
		scoreA: number,
		scoreB: number,
	) => {
		setSubmittingPrediction(true);
		try {
			const response = await sweepstakesApi.savePredictions(userEmail, [
				{ game_id: String(gameId), scoreA, scoreB },
			]);

			if (response.saved && response.saved.length > 0) {
				toast.success("Palpite computado!");
				setIsModalOpen(false);
				loadExtras(userEmail);
			} else {
				toast.error("Erro ao processar palpite.");
			}
		} catch (error) {
			console.error(error);
			toast.error("Falha na comunicação.");
		} finally {
			setSubmittingPrediction(false);
		}
	};

	const firstName = userName.split(" ")[0];

	const visibleGames = useMemo(() => {
		const filtered = hideFinished
			? games.filter(
					(game) => !(game.real_score_a !== "" && game.real_score_b !== ""),
				)
			: games;

		return [...filtered].sort((a, b) => {
			const getStatusWeight = (game: Game) => {
				const isGameFinished =
					game.real_score_a !== "" && game.real_score_b !== "";

				if (isGameFinished) {
					return 3;
				}

				const kickoffTime = new Date(game.game_date_time).getTime();
				const isTimeDone = new Date().getTime() >= kickoffTime;

				if (isTimeDone) {
					return 2;
				}

				return 1;
			};

			return getStatusWeight(a) - getStatusWeight(b);
		});
	}, [games, hideFinished]);

	return (
		<AnimatePresence mode="wait">
			{showRanking ? (
				<motion.div
					key="ranking"
					initial={{ opacity: 0, x: 48 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: 48 }}
					transition={{ duration: 0.3, ease: "easeInOut" }}
				>
					<RankingScreen
						participants={rankingList}
						onBack={() => setShowRanking(false)}
					/>
				</motion.div>
			) : (
				<motion.main
					key="dashboard"
					initial={{ opacity: 0, x: -48 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -48 }}
					transition={{ duration: 0.3, ease: "easeInOut" }}
					className="min-h-screen bg-[#0b0a07] text-neutral-100 custom-scrollbar relative overflow-x-hidden"
				>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute top-0 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-[#d4af37]/5 blur-3xl"
					/>

					{/* HEADER */}
					<header className="border-b border-neutral-800 bg-neutral-900/40 backdrop-blur relative z-10">
						<div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex items-center gap-3">
								<div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#f4d67a] to-[#d4af37] text-neutral-950 shadow-md">
									<Trophy className="size-5" />
								</div>
								<div>
									<p className="text-xs text-neutral-400">Olá,</p>
									<h1 className="text-lg font-bold leading-tight bg-gradient-to-r from-[#f4d67a] to-[#d4af37] bg-clip-text text-transparent">
										{firstName}!
									</h1>
								</div>
							</div>

							<div className="flex items-center gap-2">
								<div className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950/60 px-3 py-2">
									<Star className="size-4 text-[#f4d67a]" />
									{extrasLoading ? (
										<Loader2 className="size-3.5 animate-spin text-neutral-500" />
									) : (
										<span className="text-sm font-semibold tabular-nums text-neutral-100">
											{userPoints}
										</span>
									)}
									<span className="text-xs text-neutral-400">pts</span>
								</div>

								<Button
									variant="outline"
									onClick={() => setShowRanking(true)}
									disabled={extrasLoading || rankingList.length === 0}
									className="gap-2 border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed"
								>
									<Trophy className="size-4 text-[#d4af37]" />
									<span className="hidden sm:inline">Ver Ranking</span>
								</Button>

								<Button
									variant="ghost"
									size="icon"
									onClick={handleLogout}
									className="text-neutral-400 hover:text-destructive hover:bg-destructive/10"
								>
									<LogOut className="size-4" />
								</Button>
							</div>
						</div>
					</header>

					{/* MAIN GAMES SECTION */}
					<section className="mx-auto max-w-5xl px-4 py-4 relative z-10">
						<div className="mb-6 flex items-end justify-between">
							<div>
								<h2 className="text-lg font-bold text-neutral-100 tracking-wide">
									Jogos da Rodada
								</h2>
								<p className="text-sm text-neutral-400">
									Toque em um jogo para dar ou revisar seu palpite.
								</p>
							</div>

							<div className="flex items-center gap-1">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setHideFinished((prev) => !prev)}
									className={`gap-2 text-neutral-400 hover:text-[#f4d67a] ${
										hideFinished ? "text-[#f4d67a] bg-[#d4af37]/10" : ""
									}`}
								>
									{hideFinished ? (
										<EyeOff className="size-4" />
									) : (
										<Eye className="size-4" />
									)}
									<span className="hidden sm:inline">
										{hideFinished
											? "Finalizados ocultos"
											: "Ocultar finalizados"}
									</span>
								</Button>

								<Button
									variant="ghost"
									size="icon"
									onClick={handleRefresh}
									disabled={refreshing}
									className="text-neutral-400 hover:text-[#f4d67a]"
								>
									<RefreshCw
										className={`size-4 ${refreshing ? "animate-spin" : ""}`}
									/>
								</Button>
							</div>
						</div>

						{gamesLoading ? (
							<div className="flex flex-col items-center justify-center py-20 gap-3">
								<Loader2 className="size-8 text-[#d4af37] animate-spin shrink-0" />
								<p className="text-sm text-neutral-500">
									Sincronizando dados...
								</p>
							</div>
						) : games.length === 0 ? (
							<div className="text-center py-20 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/10">
								<p className="text-neutral-500 text-sm">
									Nenhum jogo configurado na planilha ainda.
								</p>
							</div>
						) : visibleGames.length === 0 ? (
							<div className="text-center py-20 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/10">
								<p className="text-neutral-500 text-sm">
									Todos os jogos desta rodada já foram finalizados.
								</p>
								<Button
									variant="link"
									onClick={() => setHideFinished(false)}
									className="text-[#f4d67a] mt-1"
								>
									Mostrar mesmo assim
								</Button>
							</div>
						) : (
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{visibleGames.map((game) => {
									const userPrediction = predictions.find(
										(p) => String(p.game_id) === String(game.game_id),
									);

									return (
										<GameCard
											key={game.game_id}
											game={game}
											userPrediction={userPrediction}
											onClick={() => handleOpenGame(game)}
										/>
									);
								})}
							</div>
						)}
					</section>

					<GameModal
						game={selectedGame}
						userPrediction={
							selectedGame
								? predictions.find(
										(p) => String(p.game_id) === String(selectedGame.game_id),
									)
								: undefined
						}
						open={isModalOpen}
						onOpenChange={setIsModalOpen}
						onSave={handleSavePrediction}
						submitting={submittingPrediction}
					/>
				</motion.main>
			)}
		</AnimatePresence>
	);
}
