import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import {
	Game,
	Participant,
	Prediction,
	RegisterResponse,
	SaveGameResponse,
	SavePredictionsResponse,
	ScoringConfig,
} from "./type";

// ===================== CONFIGURATION & CLIENT =====================

const ENDPOINT = process.env.NEXT_PUBLIC_API_URL as string;

const client = axios.create({
	baseURL: ENDPOINT,
});

if (!ENDPOINT) {
	console.warn(
		"NEXT_PUBLIC_API_URL is not defined. Please check your environment variables.",
	);
}

// ===================== REQUEST INTERCEPTORS =====================

client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
	config.headers["Content-Type"] = "text/plain;charset=utf-8";
	config.withCredentials = false;
	return config;
});

// ===================== EXCEPTION HANDLING (TAILWIND/SONNER) =====================

interface BackendErrorData {
	title?: string;
	message?: string;
}

export const handleAxiosException = (err: AxiosError<BackendErrorData>) => {
	if (err.response) {
		console.log("Full exception:", err.response.data?.message || err.message);
	}

	const status = err.response?.status;
	const errorData = err.response?.data;

	if (status && status >= 500) {
		if (errorData && typeof errorData !== "string") {
			toast.error(errorData.title || `Server Error (${status})`, {
				description: errorData.message || "An unexpected error occurred.",
				className: "bg-destructive text-destructive-foreground font-sans",
			});
		} else {
			toast.error(`Error: ${status}`, {
				description:
					"No error message available. Please contact the app maintainers.",
				className: "bg-destructive text-destructive-foreground font-sans",
			});
		}
	} else if (status && status >= 400 && status < 500) {
		if (errorData && typeof errorData !== "string") {
			toast.warning(errorData.title || "Warning", {
				description: errorData.message || "Please check your submitted inputs.",
				className: "bg-warning text-warning-foreground font-sans",
			});
		} else {
			toast.warning(`Warning: ${status}`, {
				description:
					"No validation message available. Please check the form data.",
				className: "bg-warning text-warning-foreground font-sans",
			});
		}
	}
};

// ===================== GENERIC REUSABLE API METHOD =====================

export async function apiFetch<T>(
	url: string,
	method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
	data?: object,
	config: object = {},
): Promise<T> {
	try {
		const response = await client({ url, method, data, ...config });
		return response.data;
	} catch (err) {
		if (axios.isAxiosError<BackendErrorData>(err)) {
			handleAxiosException(err);
		}
		throw err;
	}
}

// ============================= SWEEPSTAKES ENDPOINTS =============================

export const sweepstakesApi = {
	checkParticipant: (email: string) =>
		apiFetch<{ exists: boolean; name: string | null }>("", "GET", undefined, {
			params: { action: "checkParticipant", email },
		}),

	registerParticipant: (name: string, email: string) =>
		apiFetch<RegisterResponse>("", "POST", { action: "register", name, email }),

	getParticipants: () =>
		apiFetch<Participant[]>("", "GET", undefined, {
			params: { action: "participants" },
		}),

	getGames: () =>
		apiFetch<Game[]>("", "GET", undefined, { params: { action: "games" } }),

	saveGame: (
		game:
			| (Partial<Game> & { team_a: string; team_b: string })
			| (Partial<Game> & { game_id: string }),
	) =>
		apiFetch<SaveGameResponse>("", "POST", {
			action: "saveGame",
			game,
		}),

	getPredictions: (email: string) =>
		apiFetch<Prediction[]>("", "GET", undefined, {
			params: { action: "predictions", email },
		}),

	getAllPredictions: () =>
		apiFetch<Prediction[]>("", "GET", undefined, {
			params: { action: "allPredictions" },
		}),

	getScoringConfig: () =>
		apiFetch<ScoringConfig>("", "GET", undefined, {
			params: { action: "scoringConfig" },
		}),

	savePredictions: (
		email: string,
		predictions: { game_id: string; scoreA: number; scoreB: number }[],
	) =>
		apiFetch<SavePredictionsResponse>("", "POST", {
			action: "savePredictions",
			email,
			predictions,
		}),
};
