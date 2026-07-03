export interface Game {
	game_id: string;
	group_round: string;
	team_a: string;
	team_b: string;
	game_date_time: string;
	real_score_a: number | "";
	real_score_b: number | "";
	points_exact: number;
	points_winner: number;
}

export interface Prediction {
	email: string;
	game_id: string;
	predicted_score_a: number;
	predicted_score_b: number;
	updated_at: string;
}

export interface Participant {
	email: string;
	name: string;
	created_at: string;
}

export interface ScoringConfig {
	exact_score: number;
	correct_winner: number;
	wrong_result: number;
}

export interface RegisterResponse {
	success: boolean;
	isNew: boolean;
	name: string;
}

export interface SavePredictionsResponse {
	saved: {
		game_id: string;
		scoreA: number;
		scoreB: number;
	}[];
	skipped: {
		game_id: string;
		reason: string;
	}[];
}

export interface SaveGameResponse {
	success: boolean;
	action: "created" | "updated";
	game_id: string;
}