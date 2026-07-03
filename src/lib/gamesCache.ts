import { Game } from "./type";
import { sweepstakesApi } from "./api";

let cachedGames: Game[] | null = null;
let inFlightRequest: Promise<Game[]> | null = null;

export function prefetchGames(): Promise<Game[]> {
	if (cachedGames) return Promise.resolve(cachedGames);

	if (!inFlightRequest) {
		inFlightRequest = sweepstakesApi
			.getGames()
			.then((games) => {
				cachedGames = games;
				inFlightRequest = null;
				return games;
			})
			.catch((err) => {
				inFlightRequest = null;
				throw err;
			});
	}

	return inFlightRequest;
}

export function getCachedGames(): Game[] | null {
	return cachedGames;
}

export function setCachedGames(games: Game[]) {
	cachedGames = games;
}

export function clearGamesCache() {
	cachedGames = null;
	inFlightRequest = null;
}
