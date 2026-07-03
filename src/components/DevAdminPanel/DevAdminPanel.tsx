"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { sweepstakesApi } from "@/lib/api";
import { worldCup2026Round32, getCountryLabel } from "@/lib/utils";
import { CountryFlag } from "../GuestCup/CountryFlag";
import { Game } from "@/lib/type";

interface NewGameInput {
	game_date_time: string;
	group_round: string;
	team_a: string;
	team_b: string;
}

const selectContentClass =
	"z-[60] bg-neutral-900 border-neutral-800 text-neutral-100";

export function DevAdminPanel() {
	const [activeTab, setActiveTab] = useState<"create" | "update">("create");
	const [loading, setLoading] = useState(false);

	const [games, setGames] = useState<Game[]>([]);
	const [loadingGames, setLoadingGames] = useState(false);

	const [newGame, setNewGame] = useState<NewGameInput>({
		game_date_time: new Date().toISOString().slice(0, 16),
		group_round: "Rodada 1",
		team_a: "",
		team_b: "",
	});

	const [updateScore, setUpdateScore] = useState({
		game_id: "",
		real_score_a: "",
		real_score_b: "",
	});

	async function fetchGames() {
		setLoadingGames(true);
		try {
			const data = await sweepstakesApi.getGames();
			setGames(data);
		} catch (error) {
			console.error("Erro ao buscar jogos:", error);
		} finally {
			setLoadingGames(false);
		}
	}

	useEffect(() => {
		fetchGames();
	}, []);

	if (process.env.NODE_ENV !== "development") {
		return null;
	}

	const canCreateGame =
		newGame.team_a !== "" &&
		newGame.team_b !== "" &&
		newGame.team_a !== newGame.team_b;

	async function handleCreateGame(e: React.FormEvent) {
		e.preventDefault();
		if (!canCreateGame) return;

		loading;
		setLoading(true);
		try {
			await sweepstakesApi.saveGame({
				game_date_time: newGame.game_date_time,
				group_round: newGame.group_round,
				team_a: newGame.team_a,
				team_b: newGame.team_b,
				real_score_a: "",
				real_score_b: "",
			});

			alert("Jogo alimentado na planilha com sucesso!");
			setNewGame({
				...newGame,
				team_a: "",
				team_b: "",
				game_date_time: new Date().toISOString().slice(0, 16),
			});
			fetchGames();
		} catch (error) {
			console.error("Erro ao salvar jogo:", error);
		} finally {
			setLoading(false);
		}
	}

	function handleSelectGameToUpdate(gameId: string) {
		const game = games.find((g) => String(g.game_id) === gameId);
		setUpdateScore({
			game_id: gameId,
			real_score_a:
				game && game.real_score_a !== "" ? String(game.real_score_a) : "",
			real_score_b:
				game && game.real_score_b !== "" ? String(game.real_score_b) : "",
		});
	}

	async function handleUpdateScore(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		try {
			const scoreA =
				updateScore.real_score_a === "" ? "" : Number(updateScore.real_score_a);
			const scoreB =
				updateScore.real_score_b === "" ? "" : Number(updateScore.real_score_b);

			await sweepstakesApi.saveGame({
				game_id: updateScore.game_id,
				real_score_a: scoreA,
				real_score_b: scoreB,
			});

			alert("Placar oficial atualizado com sucesso!");
			setUpdateScore({ game_id: "", real_score_a: "", real_score_b: "" });
			fetchGames();
		} catch (error) {
			console.error("Erro ao atualizar placar:", error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Card className="fixed bottom-4 left-4 z-50 w-full max-w-sm border-amber-500/40 bg-neutral-950 p-4 shadow-2xl text-neutral-100 max-h-[80vh] overflow-y-auto">
			<div className="flex items-center justify-between border-b border-neutral-800">
				<span className="text-xs font-black tracking-widest text-amber-400 uppercase">
					🛠️ Dev Admin Panel
				</span>
				<div className="flex gap-1">
					<Button
						variant={activeTab === "create" ? "default" : "ghost"}
						size="sm"
						className="h-7 text-[10px] px-2"
						onClick={() => setActiveTab("create")}
					>
						+ Jogo
					</Button>
					<Button
						variant={activeTab === "update" ? "default" : "ghost"}
						size="sm"
						className="h-7 text-[10px] px-2"
						onClick={() => setActiveTab("update")}
					>
						Placar Final
					</Button>
				</div>
			</div>

			{activeTab === "create" ? (
				<form onSubmit={handleCreateGame} className="space-y-2.5">
					<div className="w-full">
						<Label className="text-[11px] text-neutral-400">
							Rodada / Grupo
						</Label>
						<Input
							value={newGame.group_round}
							onChange={(e) =>
								setNewGame({ ...newGame, group_round: e.target.value })
							}
							className="w-full h-8 text-xs bg-neutral-900 border-neutral-800"
							placeholder="Ex: Rodada 1"
							required
						/>
					</div>

					{/* Coluna Dupla: Metade / Metade */}
					<div className="grid grid-cols-2 gap-2">
						<div className="w-full">
							<Label className="text-[11px] text-neutral-400">Time A</Label>
							<Select
								value={newGame.team_a}
								onValueChange={(value: string) =>
									setNewGame({ ...newGame, team_a: value })
								}
							>
								<SelectTrigger className="w-full h-8 text-xs bg-neutral-900 border-neutral-800">
									<SelectValue placeholder="Selecione" />
								</SelectTrigger>
								<SelectContent className={selectContentClass}>
									{worldCup2026Round32
										.filter((c) => c.nome !== newGame.team_b)
										.map((country) => (
											<SelectItem
												key={country.nome}
												value={country.nome}
												className="text-xs focus:bg-neutral-800 focus:text-neutral-100"
											>
												<span className="flex items-center gap-2">
													<CountryFlag
														nome={country.nome}
														className="w-5 h-3.5 border border-neutral-700"
													/>
													{country.label}
												</span>
											</SelectItem>
										))}
								</SelectContent>
							</Select>
						</div>

						<div className="w-full">
							<Label className="text-[11px] text-neutral-400">Time B</Label>
							<Select
								value={newGame.team_b}
								onValueChange={(value: string) =>
									setNewGame({ ...newGame, team_b: value })
								}
							>
								<SelectTrigger className="w-full h-8 text-xs bg-neutral-900 border-neutral-800">
									<SelectValue placeholder="Selecione" />
								</SelectTrigger>
								<SelectContent className={selectContentClass}>
									{worldCup2026Round32
										.filter((c) => c.nome !== newGame.team_a)
										.map((country) => (
											<SelectItem
												key={country.nome}
												value={country.nome}
												className="text-xs focus:bg-neutral-800 focus:text-neutral-100"
											>
												<span className="flex items-center gap-2">
													<CountryFlag
														nome={country.nome}
														className="w-5 h-3.5 border border-neutral-700"
													/>
													{country.label}
												</span>
											</SelectItem>
										))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="w-full">
						<Label className="text-[11px] text-neutral-400">
							Data e Hora do Kickoff
						</Label>
						<Input
							type="datetime-local"
							value={newGame.game_date_time}
							onChange={(e) =>
								setNewGame({ ...newGame, game_date_time: e.target.value })
							}
							className="w-full h-8 text-xs bg-neutral-900 border-neutral-800"
							required
						/>
					</div>

					<Button
						type="submit"
						disabled={loading || !canCreateGame}
						className="w-full h-8 text-xs bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold"
					>
						{loading ? "Enviando..." : "Alimentar Planilha"}
					</Button>
				</form>
			) : (
				<form onSubmit={handleUpdateScore} className="space-y-2.5">
					<div className="w-full">
						<Label className="text-[11px] text-neutral-400">
							Jogo Cadastrado
						</Label>
						<Select
							value={updateScore.game_id}
							onValueChange={handleSelectGameToUpdate}
						>
							<SelectTrigger className="w-full h-8 text-xs bg-neutral-900 border-neutral-800">
								<SelectValue
									placeholder={
										loadingGames ? "Carregando jogos..." : "Selecione um jogo"
									}
								/>
							</SelectTrigger>
							<SelectContent className={selectContentClass}>
								{games.length === 0 && !loadingGames && (
									<div className="px-2 py-1.5 text-xs text-neutral-500">
										Nenhum jogo cadastrado
									</div>
								)}
								{games.map((game) => {
									const isFinished =
										game.real_score_a !== "" && game.real_score_b !== "";
									return (
										<SelectItem
											key={String(game.game_id)}
											value={String(game.game_id)}
											className="text-xs focus:bg-neutral-800 focus:text-neutral-100"
										>
											<span className="flex items-center gap-1.5">
												<CountryFlag
													nome={game.team_a}
													className="w-4 h-3 border border-neutral-700"
												/>
												{getCountryLabel(game.team_a)}
												<span className="text-neutral-500">×</span>
												<CountryFlag
													nome={game.team_b}
													className="w-4 h-3 border border-neutral-700"
												/>
												{getCountryLabel(game.team_b)}
												{isFinished && (
													<span className="ml-1 text-[10px] text-emerald-500">
														({game.real_score_a}×{game.real_score_b})
													</span>
												)}
											</span>
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>
						{updateScore.game_id && (
							<p className="mt-1 text-[10px] font-mono text-neutral-600">
								ID: {updateScore.game_id}
							</p>
						)}
					</div>

					{/* Coluna Dupla: Metade / Metade */}
					<div className="grid grid-cols-2 gap-2">
						<div className="w-full">
							<Label className="text-[11px] text-neutral-400">
								Placar Real A
							</Label>
							<Input
								type="number"
								min={0}
								value={updateScore.real_score_a}
								onChange={(e) =>
									setUpdateScore({
										...updateScore,
										real_score_a: e.target.value,
									})
								}
								className="w-full h-8 text-xs bg-neutral-900 border-neutral-800 text-center font-mono"
								placeholder="0"
								required
							/>
						</div>
						<div className="w-full">
							<Label className="text-[11px] text-neutral-400">
								Placar Real B
							</Label>
							<Input
								type="number"
								min={0}
								value={updateScore.real_score_b}
								onChange={(e) =>
									setUpdateScore({
										...updateScore,
										real_score_b: e.target.value,
									})
								}
								className="w-full h-8 text-xs bg-neutral-900 border-neutral-800 text-center font-mono"
								placeholder="0"
								required
							/>
						</div>
					</div>

					<Button
						type="submit"
						disabled={loading || !updateScore.game_id}
						className="w-full h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-neutral-100 font-bold"
					>
						{loading ? "Salvando..." : "Salvar Placar Final"}
					</Button>
				</form>
			)}
		</Card>
	);
}
